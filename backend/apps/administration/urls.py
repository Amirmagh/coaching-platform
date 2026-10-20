from django.urls import path

from .views import AnalyticsView, PaymentsView, ReportIssueView, SessionsView, UserDetailView, UsersView

urlpatterns = [
    path('users/', UsersView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),
    path('sessions/', SessionsView.as_view()),
    path('payments/', PaymentsView.as_view()),
    path('analytics/', AnalyticsView.as_view()),
    path('report-issue/', ReportIssueView.as_view()),
]
