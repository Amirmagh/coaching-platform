from django.urls import path

from .views import ResetPasswordView, SendPasswordResetView, SendVerificationView, VerifyEmailView

urlpatterns = [
    path('send-verification/', SendVerificationView.as_view()),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view()),
    path('send-reset-password/', SendPasswordResetView.as_view()),
    path('reset-password/<uuid:token>/', ResetPasswordView.as_view()),
]
