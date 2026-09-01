from django.urls import path
from .views import CrisisResourcesView, QuestionListView, SessionDetailView, SessionListView

urlpatterns = [
    path("questions/", QuestionListView.as_view()),
    path("crisis-resources/", CrisisResourcesView.as_view()),
    path("sessions/", SessionListView.as_view()),
    path("sessions/<int:pk>/", SessionDetailView.as_view()),
]
