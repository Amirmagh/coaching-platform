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
        question, new_state = next_question(state)

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

        validation = validate_response(question)
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
