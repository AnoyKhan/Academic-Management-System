from django.contrib import admin

from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee_id",
        "user",
        "department",
        "designation",
        "joining_date",
        "created_at",
    )
    list_filter = ("department", "designation", "joining_date", "created_at")
    search_fields = (
        "employee_id",
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    autocomplete_fields = ("user",)
    ordering = ("employee_id",)
