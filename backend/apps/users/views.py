from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.views import APIView

from .models import User
from .services import send_password_reset_email, send_verification_email


class EmailThrottle(UserRateThrottle):
    rate = '5/hour'


class SendVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [EmailThrottle]

    def post(self, request):
        if request.user.email_verified:
            return Response({'detail': 'Email is already verified.'}, status=status.HTTP_400_BAD_REQUEST)
        send_verification_email(request.user)
        return Response({'detail': 'Verification email sent.'})


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, token):
        user = User.objects.filter(email_verification_token=token).first()
        if not user or user.email_verification_expires_at < timezone.now():
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        user.email_verified = True
        user.email_verification_token = None
        user.save(update_fields=['email_verified', 'email_verification_token'])
        return Response({'detail': 'Email verified.'})


class SendPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [EmailThrottle]

    def post(self, request):
        user = User.objects.filter(email=request.data.get('email', '')).first()
        if user:
            send_password_reset_email(user)
        return Response({'detail': 'If the account exists, a reset email has been sent.'})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, token):
        password = request.data.get('password')
        user = User.objects.filter(password_reset_token=token).first()
        if not password or not user or user.password_reset_expires_at < timezone.now():
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(password)
        user.password_reset_token = None
        user.password_reset_expires_at = None
        user.save()
        return Response({'detail': 'Password reset successfully.'})
