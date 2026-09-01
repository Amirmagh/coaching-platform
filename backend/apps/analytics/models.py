from django.conf import settings
from django.db import models


class AnalyticsEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
