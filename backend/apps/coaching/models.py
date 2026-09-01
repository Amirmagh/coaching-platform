import uuid

from django.conf import settings
from django.db import models

from apps.coaching.engines.question_flow import GrowStage


class Goal(models.Model):
    """A coaching goal a client is working towards."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="goals"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Session(models.Model):
    """A single coaching conversation session between a client and the engine."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        PAUSED = "paused", "Paused"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions"
    )
    goal = models.ForeignKey(
        Goal, on_delete=models.SET_NULL, null=True, blank=True, related_name="sessions"
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.ACTIVE
    )
    grow_stage = models.CharField(
        max_length=10,
        choices=[(s.value, s.name) for s in GrowStage],
        default=GrowStage.GOAL.value,
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"Session {self.id} ({self.user})"


class Message(models.Model):
    """A single message within a coaching session."""

    class Sender(models.TextChoices):
        USER = "user", "User"
        COACH = "coach", "Coach"
        SYSTEM = "system", "System"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.CharField(max_length=10, choices=Sender.choices)
    text = models.TextField()
    crisis_level = models.CharField(max_length=10, blank=True, default="none")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender}: {self.text[:40]}"
