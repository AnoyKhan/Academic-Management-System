from django.db import models
from django.db.models import Avg, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.permissions import IsStudent
from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from .models import Student
from .serializers import (
    AssignmentSubmissionSerializer,
    CourseSerializer,
    StudentAssignmentSerializer,
    StudentAttendanceSerializer,
    StudentGradeSerializer,
    StudentNotificationSerializer,
    StudentProfileSerializer,
)


class StudentBaseAPIView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get_student(self):
        return get_object_or_404(
            Student.objects.select_related("user"),
            user=self.request.user,
        )

    def get_student_courses(self, student):
        return (
            Course.objects.select_related("teacher__user")
            .filter(
                Q(attendance_records__student=student)
                | Q(assignments__submissions__student=student)
                | Q(assignments__grades__student=student),
            )
            .distinct()
        )


class StudentProfileView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        return success_response(
            "Profile retrieved successfully",
            {"student": StudentProfileSerializer(student).data},
        )


class StudentCourseListView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        courses = self.get_student_courses(student)
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(courses, request, view=self)
        serializer = CourseSerializer(page, many=True)
        return paginator.get_paginated_response(
            serializer.data,
            message="Courses retrieved successfully",
        )


class StudentAssignmentListView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        courses = self.get_student_courses(student)
        assignments = (
            Assignment.objects.select_related("course")
            .prefetch_related(
                models.Prefetch(
                    "submissions",
                    queryset=Submission.objects.filter(student=student),
                    to_attr="student_submissions",
                ),
            )
            .filter(course__in=courses)
        )
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(assignments, request, view=self)
        serializer = StudentAssignmentSerializer(
            page,
            many=True,
            context={"student": student},
        )
        return paginator.get_paginated_response(
            serializer.data,
            message="Assignments retrieved successfully",
        )


class StudentAssignmentSubmitView(StudentBaseAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, assignment_id):
        student = self.get_student()
        courses = self.get_student_courses(student)
        assignment = get_object_or_404(
            Assignment.objects.select_related("course"),
            id=assignment_id,
            course__in=courses,
        )
        submission_date = timezone.now()
        submission_status = (
            Submission.Status.LATE
            if submission_date > assignment.deadline
            else Submission.Status.SUBMITTED
        )
        serializer = AssignmentSubmissionSerializer(
            data=request.data,
            context={
                "assignment": assignment,
                "student": student,
                "submission_date": submission_date,
                "submission_status": submission_status,
            },
        )
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        return success_response(
            "Assignment submitted successfully",
            {
                "submission_id": submission.id,
                "status": submission.status,
            },
            status_code=status.HTTP_201_CREATED,
        )


class StudentGradeListView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        grades = (
            Grade.objects.select_related("assignment__course")
            .filter(student=student)
            .order_by("-created_at")
        )
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(grades, request, view=self)
        serializer = StudentGradeSerializer(page, many=True)
        return paginator.get_paginated_response(
            serializer.data,
            message="Grades retrieved successfully",
        )


class StudentAttendanceListView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        attendance = (
            Attendance.objects.select_related("course")
            .filter(student=student)
            .order_by("-date")
        )
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(attendance, request, view=self)
        serializer = StudentAttendanceSerializer(page, many=True)
        return paginator.get_paginated_response(
            serializer.data,
            message="Attendance retrieved successfully",
        )


class StudentDashboardView(StudentBaseAPIView):
    def get(self, request):
        student = self.get_student()
        courses = self.get_student_courses(student)
        assignments = Assignment.objects.filter(course__in=courses)
        submitted_assignment_ids = Submission.objects.filter(
            student=student,
        ).values_list("assignment_id", flat=True)
        pending_assignments = assignments.exclude(
            id__in=submitted_assignment_ids,
        ).count()
        grades = Grade.objects.filter(student=student)
        average_marks = grades.aggregate(value=Avg("marks"))["value"]
        attendance_records = Attendance.objects.filter(student=student)
        attendance_total = attendance_records.count()
        present_count = attendance_records.filter(
            status=Attendance.Status.PRESENT,
        ).count()
        attendance_percentage = (
            round((present_count / attendance_total) * 100, 2)
            if attendance_total
            else 0
        )
        recent_grades = grades.select_related("assignment__course").order_by(
            "-created_at",
        )[:5]

        return success_response(
            "Dashboard retrieved successfully",
            {
                "total_courses": courses.count(),
                "pending_assignments": pending_assignments,
                "average_marks": round(float(average_marks), 2)
                if average_marks is not None
                else 0,
                "attendance_percentage": attendance_percentage,
                "recent_grades": StudentGradeSerializer(
                    recent_grades,
                    many=True,
                ).data,
            },
        )


class StudentNotificationListView(StudentBaseAPIView):
    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user).order_by(
            "-created_at",
        )
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(notifications, request, view=self)
        serializer = StudentNotificationSerializer(page, many=True)
        return paginator.get_paginated_response(
            serializer.data,
            message="Notifications retrieved successfully",
        )
