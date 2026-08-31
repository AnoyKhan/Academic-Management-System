from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.notifications.models import Notification
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response

from .serializers import NotificationSerializer


class NotificationBaseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def paginate(self, queryset, serializer_class, message, context=None):
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        serializer = serializer_class(page, many=True, context=context or {})
        return paginator.get_paginated_response(serializer.data, message=message)


class NotificationListView(NotificationBaseAPIView):
    def get(self, request):
        queryset = Notification.objects.filter(receiver=request.user).order_by("-created_at")
        if request.query_params.get("unread") == "true":
            queryset = queryset.filter(is_read=False)
        return self.paginate(queryset, NotificationSerializer, "Notifications fetched successfully.")

    def post(self, request):
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response("You do not have permission to create notifications.", status_code=status.HTTP_403_FORBIDDEN)
        receiver = request.data.get("receiver_id")
        if receipt := receiver:
            target = get_object_or_404(User.objects.all(), id=receipt)
        else:
            target = request.user
        notification = Notification.objects.create(
            receiver=target,
            title=request.data.get("title", "System notification"),
            message=request.data.get("message", ""),
            is_read=request.data.get("is_read", False),
        )
        return success_response("Notification created successfully.", {"notification": NotificationSerializer(notification).data}, status_code=status.HTTP_201_CREATED)


class NotificationDetailView(NotificationBaseAPIView):
    def get_object(self, notification_id):
        return get_object_or_404(Notification.objects.filter(receiver=self.request.user), id=notification_id)

    def patch(self, request, notification_id):
        notification = self.get_object(notification_id)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return success_response("Notification marked as read.", {"notification": NotificationSerializer(notification).data})
