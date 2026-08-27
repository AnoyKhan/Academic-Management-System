from django.contrib import admin

from .models import Grade


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "assignment",
        "marks",
        "graded_by",
        "created_at",
    )
    list_filter = ("graded_by", "assignment__course", "created_at")
    search_fields = (
        "student__student_id",
        "student__user__first_name",
        "student__user__last_name",
        "assignment__title",
    )
    autocomplete_fields = ("student", "assignment", "graded_by")
    ordering = ("-created_at",)
