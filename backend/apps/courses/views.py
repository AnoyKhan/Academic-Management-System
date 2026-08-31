from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin, IsStudent, IsTeacher
from apps.courses.models import Course
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher

from .serializers import CourseSerializer, CourseWriteSerializer


class CourseBaseAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def paginate(self, queryset, serializer_class, message, **kwargs):
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        serializer = serializer_class(page, many=True, **kwargs)
        return paginator.get_paginated_response(serializer.data, message=message)


class CourseListView(CourseBaseAPIView):
    def get(self, request):
        user = request.user

        if user.role == "ADMIN":
            queryset = Course.objects.select_related("teacher__user").all()
            return self.paginate(queryset, CourseSerializer, "Courses fetched successfully.")

        if user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=user)
            queryset = Course.objects.select_related("teacher__user").filter(teacher=teacher)
            return self.paginate(queryset, CourseSerializer, "Teacher courses fetched successfully.")

        student = get_object_or_404(Student.objects.select_related("user"), user=user)
        queryset = (
            Course.objects.select_related("teacher__user")
            .filter(
                Q(attendance_records__student=student)
                | Q(assignments__submissions__student=student)
                | Q(assignments__grades__student=student)
            )
            .distinct()
            .order_by("course_code")
        )
        return self.paginate(queryset, CourseSerializer, "Courses fetched successfully.")

    def post(self, request):
        if not (request.user.role == "ADMIN" or request.user.role == "TEACHER"):
            return success_response(
                "You do not have permission to create courses.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        teacher = None
        if request.user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=request.user)

        serializer = CourseWriteSerializer(
            data=request.data,
            context={"teacher": teacher},
        )
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return success_response(
            "Course created successfully.",
            {"course": CourseSerializer(course).data},
            status_code=status.HTTP_201_CREATED,
        )


class CourseDetailView(CourseBaseAPIView):
    def get_object(self, course_id):
        return get_object_or_404(Course.objects.select_related("teacher__user"), id=course_id)

    def get(self, request, course_id):
        course = self.get_object(course_id)
        user = request.user

        if user.role == "ADMIN":
            return success_response("Course fetched successfully.", {"course": CourseSerializer(course).data})

        if user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=user)
            if course.teacher_id != teacher.id:
                return success_response(
                    "You can only view your own courses.",
                    status_code=status.HTTP_403_FORBIDDEN,
                )
            return success_response("Course fetched successfully.", {"course": CourseSerializer(course).data})

        student = get_object_or_404(Student.objects.select_related("user"), user=user)
        allowed = (
            course.attendance_records.filter(student=student).exists()
            or course.assignments.filter(submissions__student=student).exists()
            or course.assignments.filter(grades__student=student).exists()
        )
        if not allowed:
            return success_response(
                "You are not enrolled in this course.",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        return success_response("Course fetched successfully.", {"course": CourseSerializer(course).data})

    def put(self, request, course_id):
        course = self.get_object(course_id)
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response(
                "You do not have permission to update this course.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        if request.user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=request.user)
            if course.teacher_id != teacher.id:
                return success_response(
                    "You can only update your own courses.",
                    status_code=status.HTTP_403_FORBIDDEN,
                )

        serializer = CourseWriteSerializer(
            course,
            data=request.data,
            partial=True,
            context={"teacher": getattr(course, "teacher", None)},
        )
        serializer.is_valid(raise_exception=True)
        updated_course = serializer.save()
        return success_response(
            "Course updated successfully.",
            {"course": CourseSerializer(updated_course).data},
        )

    def delete(self, request, course_id):
        course = self.get_object(course_id)
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response(
                "You do not have permission to delete this course.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        if request.user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=request.user)
            if course.teacher_id != teacher.id:
                return success_response(
                    "You can only delete your own courses.",
                    status_code=status.HTTP_403_FORBIDDEN,
                )

        course.delete()
        return success_response("Course deleted successfully.")

