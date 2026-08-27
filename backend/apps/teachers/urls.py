from django.urls import path

from .views import (
    TeacherAssignmentDetailView,
    TeacherAssignmentListCreateView,
    TeacherAttendanceDetailView,
    TeacherAttendanceListCreateView,
    TeacherCourseListView,
    TeacherDashboardView,
    TeacherNotificationListView,
    TeacherProfileView,
    TeacherSubmissionDetailView,
    TeacherSubmissionGradeView,
    TeacherSubmissionListView,
)


app_name = "teachers"

urlpatterns = [
    path("profile/", TeacherProfileView.as_view(), name="teacher-profile"),
    path("dashboard/", TeacherDashboardView.as_view(), name="teacher-dashboard"),
    path("courses/", TeacherCourseListView.as_view(), name="teacher-courses"),
    path("assignments/", TeacherAssignmentListCreateView.as_view(), name="teacher-assignments"),
    path("assignments/<int:assignment_id>/", TeacherAssignmentDetailView.as_view(), name="teacher-assignment-detail"),
    path("submissions/", TeacherSubmissionListView.as_view(), name="teacher-submissions"),
    path("submissions/<int:submission_id>/", TeacherSubmissionDetailView.as_view(), name="teacher-submission-detail"),
    path("submissions/<int:submission_id>/grade/", TeacherSubmissionGradeView.as_view(), name="teacher-submission-grade"),
    path("attendance/", TeacherAttendanceListCreateView.as_view(), name="teacher-attendance"),
    path("attendance/<int:attendance_id>/", TeacherAttendanceDetailView.as_view(), name="teacher-attendance-detail"),
    path("notifications/", TeacherNotificationListView.as_view(), name="teacher-notifications"),
]
