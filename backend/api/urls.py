from django.urls import include, path

from .views import (
    HealthCheckAPIView,
    TokenObtainPairAPIView,
    TokenRefreshAPIView,
    TokenVerifyAPIView,
)


urlpatterns = [
    path("health/", HealthCheckAPIView.as_view(), name="health-check"),
    path(
        "auth/",
        include(
            [
                path("token/", TokenObtainPairAPIView.as_view(), name="token-obtain-pair"),
                path("token/refresh/", TokenRefreshAPIView.as_view(), name="token-refresh"),
                path("token/verify/", TokenVerifyAPIView.as_view(), name="token-verify"),
                path("", include("apps.accounts.urls")),
            ],
        ),
    ),
    path(
        "student/",
        include(("apps.students.urls", "students"), namespace="student"),
    ),
    path("teacher/", include("apps.teachers.urls")),
    path("admin/", include("api.admin_urls")),
    path("course/", include("apps.courses.urls")),
    path("assignment/", include("apps.assignments.urls")),
    path("grade/", include("apps.grades.urls")),
    path("attendance/", include("apps.attendance.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("analytics/", include("apps.analytics.urls")),
]
