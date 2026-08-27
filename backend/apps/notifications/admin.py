from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "receiver",
        "title",
        "is_read",
        "created_at",
    )
    list_filter = ("is_read", "created_at")
    search_fields = (
        "title",
        "message",
        "receiver__username",
        "receiver__email",
        "receiver__first_name",
        "receiver__last_name",
    )
    autocomplete_fields = ("receiver",)
    ordering = ("-created_at",)
