from django.urls import path

from .admin_views import (
    AdminAnalyticsView,
    AdminAssignmentDetailView,
    AdminAssignmentListCreateView,
    AdminAttendanceListCreateView,
    AdminCourseDetailView,
    AdminCourseListCreateView,
    AdminDashboardView,
    AdminGradeListCreateView,
    AdminNotificationListCreateView,
    AdminStudentDetailView,
    AdminStudentListCreateView,
    AdminTeacherDetailView,
    AdminTeacherListCreateView,
    AdminUserDetailView,
    AdminUserListCreateView,
)


app_name = "admin_api"

urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("users/", AdminUserListCreateView.as_view(), name="admin-users"),
    path("users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("students/", AdminStudentListCreateView.as_view(), name="admin-students"),
    path("students/<int:student_id>/", AdminStudentDetailView.as_view(), name="admin-student-detail"),
    path("teachers/", AdminTeacherListCreateView.as_view(), name="admin-teachers"),
    path("teachers/<int:teacher_id>/", AdminTeacherDetailView.as_view(), name="admin-teacher-detail"),
    path("courses/", AdminCourseListCreateView.as_view(), name="admin-courses"),
    path("courses/<int:course_id>/", AdminCourseDetailView.as_view(), name="admin-course-detail"),
    path("assignments/", AdminAssignmentListCreateView.as_view(), name="admin-assignments"),
    path("assignments/<int:assignment_id>/", AdminAssignmentDetailView.as_view(), name="admin-assignment-detail"),
    path("grades/", AdminGradeListCreateView.as_view(), name="admin-grades"),
    path("attendance/", AdminAttendanceListCreateView.as_view(), name="admin-attendance"),
    path("notifications/", AdminNotificationListCreateView.as_view(), name="admin-notifications"),
    path("analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
]
