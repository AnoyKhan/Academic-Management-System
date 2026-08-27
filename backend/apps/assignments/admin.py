from django.contrib import admin

from .models import Assignment, Submission


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "course",
        "created_by",
        "deadline",
        "created_at",
    )
    list_filter = ("course", "created_by", "deadline", "created_at")
    search_fields = (
        "title",
        "course__course_code",
        "course__course_name",
        "created_by__employee_id",
    )
    autocomplete_fields = ("course", "created_by")
    ordering = ("-deadline",)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "assignment",
        "student",
        "status",
        "submission_date",
    )
    list_filter = ("status", "assignment__course", "submission_date")
    search_fields = (
        "assignment__title",
        "student__student_id",
        "student__user__first_name",
        "student__user__last_name",
    )
    autocomplete_fields = ("assignment", "student")
    ordering = ("-submission_date", "-id")
