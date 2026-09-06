from celery import shared_task

from .models import User
from .services import send_password_reset_email, send_verification_email


@shared_task
def send_verification_email_task(user_id):
    send_verification_email(User.objects.get(pk=user_id))


@shared_task
def send_password_reset_email_task(user_id):
    send_password_reset_email(User.objects.get(pk=user_id))
