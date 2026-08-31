from django.urls import path

from .views import AnalyticsOverviewView, StudentAnalyticsView, TeacherAnalyticsView


app_name = "analytics"

urlpatterns = [
    path("student/", StudentAnalyticsView.as_view(), name="student-analytics"),
    path("teacher/", TeacherAnalyticsView.as_view(), name="teacher-analytics"),
    path("", AnalyticsOverviewView.as_view(), name="analytics-overview"),
]
