from rest_framework import serializers

from apps.analytics.models import AnalyticsEvent


class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = ["id", "event_type", "metadata", "created_at"]
        read_only_fields = ["id", "created_at"]
