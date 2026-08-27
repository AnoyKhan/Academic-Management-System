from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student_id",
        "user",
        "department",
        "intake",
        "batch",
        "semester",
        "created_at",
    )
    list_filter = ("department", "intake", "batch", "semester", "created_at")
    search_fields = (
        "student_id",
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    autocomplete_fields = ("user",)
    ordering = ("student_id",)
