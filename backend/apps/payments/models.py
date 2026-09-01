from django.conf import settings
from django.db import models


class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.CharField(max_length=30, default="free")
    active = models.BooleanField(default=True)
    started_at = models.DateTimeField(auto_now_add=True)
