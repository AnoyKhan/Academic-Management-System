from django.urls import path

from .views import NotificationDetailView, NotificationListView


app_name = "notifications"

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<int:notification_id>/", NotificationDetailView.as_view(), name="notification-detail"),
]
