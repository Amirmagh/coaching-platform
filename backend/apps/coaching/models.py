from django.conf import settings
from django.db import models


class Question(models.Model):
    class Phase(models.TextChoices):
        GOAL = "goal", "هدف"
        REALITY = "reality", "واقعیت"
        OPTIONS = "options", "گزینه‌ها"
        WILL = "will", "اراده"

    phase = models.CharField(max_length=10, choices=Phase.choices)
    text = models.TextField()
    order = models.PositiveSmallIntegerField()

    class Meta:
        ordering = ("phase", "order")
        constraints = [models.UniqueConstraint(fields=("phase", "order"), name="unique_question_order")]


class CrisisResource(models.Model):
    title = models.CharField(max_length=120)
    contact = models.CharField(max_length=120)
    description = models.TextField()
    is_emergency = models.BooleanField(default=False)


class CoachingSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="coaching_sessions")
    current_phase = models.CharField(max_length=10, choices=Question.Phase.choices, default=Question.Phase.GOAL)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)


class Message(models.Model):
    session = models.ForeignKey(CoachingSession, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=(("user", "کاربر"), ("coach", "کوچ")))
    content = models.TextField()
    crisis_detected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
