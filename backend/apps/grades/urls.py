from django.urls import path

from .views import GradeListView


app_name = "grades"

urlpatterns = [
    path("", GradeListView.as_view(), name="grade-list"),
]
