from django.contrib import admin

from apps.coaching.models import Goal, Message, Session


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "is_achieved", "created_at"]
    search_fields = ["title", "user__email"]


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ["id", "created_at"]


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status", "grow_stage", "started_at"]
    list_filter = ["status", "grow_stage"]
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["session", "sender", "crisis_level", "created_at"]
    list_filter = ["sender", "crisis_level"]
