from rest_framework import serializers
from .models import CoachingSession, CrisisResource, Message, Question


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "phase", "text", "order")


class CrisisResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrisisResource
        fields = ("title", "contact", "description", "is_emergency")


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("id", "sender", "content", "crisis_detected", "created_at")
        read_only_fields = ("sender", "crisis_detected", "created_at")


class CoachingSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = CoachingSession
        fields = ("id", "current_phase", "created_at", "completed_at", "messages")
        read_only_fields = ("created_at", "completed_at")
