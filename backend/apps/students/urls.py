from django.urls import path

from .views import (
    StudentAssignmentListView,
    StudentAssignmentSubmitView,
    StudentAttendanceListView,
    StudentCourseListView,
    StudentDashboardView,
    StudentGradeListView,
    StudentProfileView,
)


app_name = "students"

urlpatterns = [
    path("profile/", StudentProfileView.as_view(), name="student-profile"),
    path("courses/", StudentCourseListView.as_view(), name="student-courses"),
    path(
        "assignments/",
        StudentAssignmentListView.as_view(),
        name="student-assignments",
    ),
    path(
        "assignments/<int:assignment_id>/submit/",
        StudentAssignmentSubmitView.as_view(),
        name="student-assignment-submit",
    ),
    path("grades/", StudentGradeListView.as_view(), name="student-grades"),
    path(
        "attendance/",
        StudentAttendanceListView.as_view(),
        name="student-attendance",
    ),
    path("dashboard/", StudentDashboardView.as_view(), name="student-dashboard"),
]
