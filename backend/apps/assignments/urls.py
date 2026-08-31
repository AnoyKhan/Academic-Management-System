from django.urls import path

from .views import (
    AssignmentDetailView,
    AssignmentListView,
    SubmissionDetailView,
    SubmissionListView,
)


app_name = "assignments"

urlpatterns = [
    path("", AssignmentListView.as_view(), name="assignment-list"),
    path("<int:assignment_id>/", AssignmentDetailView.as_view(), name="assignment-detail"),
    path("submissions/", SubmissionListView.as_view(), name="submission-list"),
    path("submissions/<int:submission_id>/", SubmissionDetailView.as_view(), name="submission-detail"),
]
