from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher

from .serializers import AttendanceSerializer


class AttendanceBaseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def paginate(self, queryset, serializer_class, message, context=None):
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        serializer = serializer_class(page, many=True, context=context or {})
        return paginator.get_paginated_response(serializer.data, message=message)

    def get_student(self):
        return get_object_or_404(Student.objects.select_related("user"), user=self.request.user)

    def get_teacher(self):
        return get_object_or_404(Teacher.objects.select_related("user"), user=self.request.user)


class AttendanceListView(AttendanceBaseAPIView):
    def get(self, request):
        if request.user.role == "STUDENT":
            queryset = Attendance.objects.select_related("student__user", "course__teacher__user").filter(student=self.get_student())
        elif request.user.role == "TEACHER":
            teacher = self.get_teacher()
            queryset = Attendance.objects.select_related("student__user", "course__teacher__user").filter(course__teacher=teacher)
        else:
            queryset = Attendance.objects.select_related("student__user", "course__teacher__user").all()
        return self.paginate(queryset.order_by("-date"), AttendanceSerializer, "Attendance fetched successfully.", context={"teacher": self.get_teacher() if request.user.role == "TEACHER" else None})

    def post(self, request):
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response("You do not have permission to record attendance.", status_code=status.HTTP_403_FORBIDDEN)

        teacher = self.get_teacher() if request.user.role == "TEACHER" else None
        serializer = AttendanceSerializer(data=request.data, context={"teacher": teacher})
        serializer.is_valid(raise_exception=True)
        course = serializer.validated_data["course"]

        if request.user.role == "TEACHER" and course.teacher_id != teacher.id:
            return success_response("You can only record attendance for your own courses.", status_code=status.HTTP_403_FORBIDDEN)

        attendance = Attendance.objects.create(
            student=serializer.validated_data["student"],
            course=course,
            date=serializer.validated_data["date"],
            status=serializer.validated_data["status"],
        )
        return success_response("Attendance recorded successfully.", {"attendance": AttendanceSerializer(attendance, context={"teacher": teacher}).data}, status_code=status.HTTP_201_CREATED)
