from django.conf import settings
from django.db import models


class Payment(models.Model):
    class Gateway(models.TextChoices):
        ZARINPAL = 'zarinpal', 'ZarinPal'
        MELLAT = 'mellat', 'Mellat'
        STRIPE = 'stripe', 'Stripe'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='payments')
    amount = models.PositiveBigIntegerField()
    gateway = models.CharField(max_length=16, choices=Gateway.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    authority = models.CharField(max_length=128, unique=True)
    transaction_id = models.CharField(max_length=128, blank=True)
    receipt_url = models.URLField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
