from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.coaching.engines.crisis_detection import detect_crisis
from apps.coaching.engines.question_flow import GrowStage, QuestionFlowState, next_question
from apps.coaching.engines.response_validation import validate_response
from apps.coaching.models import Goal, Message, Session
from apps.coaching.serializers import (
    GoalSerializer,
    MessageCreateSerializer,
    MessageSerializer,
    SessionSerializer,
)

# ICF-aligned fallback question used only if every candidate question from the
# GROW question bank unexpectedly fails response validation.
FALLBACK_QUESTION = "چه چیز دیگری مایلید در این باره با من در میان بگذارید؟"

# Upper bound on how many candidate questions to try before falling back;
# comfortably larger than the total number of questions across all GROW stages.
MAX_QUESTION_ATTEMPTS = 32


class GoalViewSet(viewsets.ModelViewSet):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return Session.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def _flow_state(self, session: Session) -> QuestionFlowState:
        asked = list(
            session.messages.filter(sender=Message.Sender.COACH).values_list(
                "text", flat=True
            )
        )
        return QuestionFlowState(
            stage=GrowStage(session.grow_stage), asked_questions=frozenset(asked)
        )

    def _select_valid_question(self, state: QuestionFlowState):
        """Pick the next question, skipping any candidate that fails
        response validation (advice-giving, interpretation, judgment), and
        falling back to a safe generic question if none validate."""
        candidate_state = state
        for _ in range(MAX_QUESTION_ATTEMPTS):
            question, candidate_state = next_question(candidate_state)
            if question is None:
                return None, candidate_state, None
            validation = validate_response(question)
            if validation.is_valid:
                return question, candidate_state, validation

        fallback_validation = validate_response(FALLBACK_QUESTION)
        return FALLBACK_QUESTION, candidate_state, fallback_validation

    @action(detail=True, methods=["post"])
    def message(self, request, pk=None):
        """Accept a client message, run it through the coaching engines, and
        return the coach's next question (or a crisis response)."""
        session = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = MessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        text = serializer.validated_data["text"]

        crisis = detect_crisis(text)

        user_message = Message.objects.create(
            session=session,
            sender=Message.Sender.USER,
            text=text,
            crisis_level=crisis.level.value,
        )

        if crisis.requires_immediate_action:
            coach_message = Message.objects.create(
                session=session,
                sender=Message.Sender.SYSTEM,
                text=crisis.message_fa,
                crisis_level=crisis.level.value,
            )
            return Response(
                {
                    "user_message": MessageSerializer(user_message).data,
                    "coach_message": MessageSerializer(coach_message).data,
                    "crisis": crisis.to_dict(),
                },
                status=status.HTTP_200_OK,
            )

        state = self._flow_state(session)
        question, new_state, validation = self._select_valid_question(state)

        if question is None:
            session.status = Session.Status.COMPLETED
            session.ended_at = timezone.now()
            session.save(update_fields=["status", "ended_at"])
            return Response(
                {
                    "user_message": MessageSerializer(user_message).data,
                    "coach_message": None,
                    "session_completed": True,
                },
                status=status.HTTP_200_OK,
            )

        if session.grow_stage != new_state.stage.value:
            session.grow_stage = new_state.stage.value
            session.save(update_fields=["grow_stage"])

        coach_message = Message.objects.create(
            session=session, sender=Message.Sender.COACH, text=question
        )

        return Response(
            {
                "user_message": MessageSerializer(user_message).data,
                "coach_message": MessageSerializer(coach_message).data,
                "validation": validation.to_dict(),
            },
            status=status.HTTP_200_OK,
        )
