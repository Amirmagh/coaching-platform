from django.conf import settings
from django.core.mail import send_mail


def send_verification_email(user):
    token = user.issue_verification_token()
    send_mail(
        'تأیید ایمیل حساب کاربری',
        f'برای تأیید ایمیل خود این لینک را باز کنید: {settings.FRONTEND_URL}/verify-email/{token}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_password_reset_email(user):
    token = user.issue_password_reset_token()
    send_mail(
        'بازنشانی گذرواژه',
        f'برای بازنشانی گذرواژه این لینک را باز کنید: {settings.FRONTEND_URL}/reset-password/{token}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
