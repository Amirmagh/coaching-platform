import uuid
from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


def verification_expiry():
    return timezone.now() + timedelta(minutes=15)


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MODERATOR = 'moderator', 'Moderator'
        COACH = 'coach', 'Coach'
        USER = 'user', 'User'

    role = models.CharField(max_length=16, choices=Role.choices, default=Role.USER)
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.UUIDField(default=uuid.uuid4, null=True, blank=True, unique=True)
    email_verification_expires_at = models.DateTimeField(default=verification_expiry)
    password_reset_token = models.UUIDField(null=True, blank=True, unique=True)
    password_reset_expires_at = models.DateTimeField(null=True, blank=True)

    def issue_verification_token(self):
        self.email_verification_token = uuid.uuid4()
        self.email_verification_expires_at = timezone.now() + timedelta(minutes=15)
        self.save(update_fields=['email_verification_token', 'email_verification_expires_at'])
        return self.email_verification_token

    def issue_password_reset_token(self):
        self.password_reset_token = uuid.uuid4()
        self.password_reset_expires_at = timezone.now() + timedelta(minutes=15)
        self.save(update_fields=['password_reset_token', 'password_reset_expires_at'])
        return self.password_reset_token
