from rest_framework import serializers

from apps.payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id", "amount_rial", "status", "gateway_ref_id", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "gateway_ref_id", "created_at", "updated_at"]
