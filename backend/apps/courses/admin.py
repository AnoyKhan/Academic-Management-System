from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "course_code",
        "course_name",
        "credit",
        "teacher",
        "created_at",
    )
    list_filter = ("credit", "teacher__department", "created_at")
    search_fields = (
        "course_code",
        "course_name",
        "teacher__employee_id",
        "teacher__user__first_name",
        "teacher__user__last_name",
    )
    autocomplete_fields = ("teacher",)
    ordering = ("course_code",)
