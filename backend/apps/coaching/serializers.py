from rest_framework import serializers

from apps.coaching.models import Goal, Message, Session


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ["id", "title", "description", "is_achieved", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "session", "sender", "text", "crisis_level", "created_at"]
        read_only_fields = ["id", "crisis_level", "created_at"]


class SessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = [
            "id", "goal", "status", "grow_stage", "started_at", "ended_at", "messages",
        ]
        read_only_fields = ["id", "grow_stage", "started_at", "ended_at"]


class MessageCreateSerializer(serializers.Serializer):
    text = serializers.CharField(allow_blank=False)
