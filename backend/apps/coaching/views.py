from rest_framework import generics
from .models import CoachingSession, CrisisResource, Question
from .serializers import CoachingSessionSerializer, CrisisResourceSerializer, QuestionSerializer


class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = ()

    def get_queryset(self):
        return Question.objects.filter(phase=self.request.query_params.get("phase")) if self.request.query_params.get("phase") else Question.objects.all()


class CrisisResourcesView(generics.ListAPIView):
    queryset = CrisisResource.objects.all()
    serializer_class = CrisisResourceSerializer
    permission_classes = ()


class SessionListView(generics.ListCreateAPIView):
    serializer_class = CoachingSessionSerializer

    def get_queryset(self):
        return CoachingSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SessionDetailView(generics.RetrieveAPIView):
    serializer_class = CoachingSessionSerializer

    def get_queryset(self):
        return CoachingSession.objects.filter(user=self.request.user)

# Create your views here.
