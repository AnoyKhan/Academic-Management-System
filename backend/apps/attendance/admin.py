from django.contrib import admin

from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "course",
        "date",
        "status",
        "created_at",
    )
    list_filter = ("status", "course", "date", "created_at")
    search_fields = (
        "student__student_id",
        "student__user__first_name",
        "student__user__last_name",
        "course__course_code",
        "course__course_name",
    )
    autocomplete_fields = ("student", "course")
    ordering = ("-date",)
