from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = ("role", "is_active", "is_staff", "is_superuser", "created_at")
    search_fields = ("username", "email", "first_name", "last_name", "phone")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = DjangoUserAdmin.fieldsets + (
        (
            "AMS Profile",
            {
                "fields": (
                    "phone",
                    "role",
                    "profile_image",
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (
            "AMS Profile",
            {
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "phone",
                    "role",
                    "profile_image",
                ),
            },
        ),
    )
