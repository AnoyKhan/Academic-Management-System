from django.db import IntegrityError, transaction
from django.db.models import Count, Exists, OuterRef, Q, Subquery
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.permissions import IsTeacher
from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student

from .models import Teacher
from .serializers import (
    TeacherAssignmentSerializer,
    TeacherAttendanceSerializer,
    TeacherCourseSerializer,
    TeacherGradeSerializer,
    TeacherNotificationSerializer,
    TeacherProfileSerializer,
    TeacherSubmissionSerializer,
)


class TeacherBaseAPIView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_teacher(self):
        return get_object_or_404(
            Teacher.objects.select_related("user"),
            user=self.request.user,
        )

    def get_teacher_courses(self):
        return Course.objects.select_related("teacher__user").filter(teacher=self.get_teacher())

    def paginate(self, queryset, serializer_class, message, context=None):
        paginator = StandardPageNumberPagination()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        serializer = serializer_class(page, many=True, context=context or {})
        return paginator.get_paginated_response(serializer.data, message=message)


class TeacherProfileView(TeacherBaseAPIView):
    def get(self, request):
        teacher = self.get_teacher()
        return success_response(
            "Teacher profile fetched successfully.",
            {"teacher": TeacherProfileSerializer(teacher, context={"request": request}).data},
        )


class TeacherDashboardView(TeacherBaseAPIView):
    def get(self, request):
        teacher = self.get_teacher()
        teacher_courses = self.get_teacher_courses()
        teacher_assignments = Assignment.objects.filter(course__teacher=teacher)

        grade_subquery = Grade.objects.filter(
            student=OuterRef("student"),
            assignment=OuterRef("assignment"),
        )

        recent_submissions = (
            Submission.objects.select_related(
                "assignment__course",
                "student__user",
            )
            .annotate(
                grade_id=Subquery(grade_subquery.values("id")[:1]),
                grade_marks=Subquery(grade_subquery.values("marks")[:1]),
                grade_feedback=Subquery(grade_subquery.values("feedback")[:1]),
            )
            .filter(assignment__course__teacher=teacher)
            .order_by("-submission_date", "-id")[:5]
        )

        recent_notifications = Notification.objects.filter(receiver=request.user).order_by("is_read", "-created_at")[:5]

        total_students = (
            Student.objects.filter(
                Q(attendance_records__course__teacher=teacher)
                | Q(submissions__assignment__course__teacher=teacher)
                | Q(grades__assignment__course__teacher=teacher),
            )
            .distinct()
            .count()
        )
        pending_submissions = (
            Submission.objects.filter(assignment__course__teacher=teacher)
            .annotate(
                has_grade=Exists(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ),
                )
            )
            .filter(has_grade=False)
            .count()
        )

        return success_response(
            "Teacher dashboard fetched successfully.",
            {
                "total_courses": teacher_courses.count(),
                "total_students": total_students,
                "total_assignments": teacher_assignments.count(),
                "pending_submissions": pending_submissions,
                "recent_submissions": TeacherSubmissionSerializer(recent_submissions, many=True).data,
                "recent_notifications": TeacherNotificationSerializer(recent_notifications, many=True).data,
            },
        )


class TeacherCourseListView(TeacherBaseAPIView):
    def get(self, request):
        courses = self.get_teacher_courses().prefetch_related("assignments")
        return self.paginate(courses, TeacherCourseSerializer, "Teacher courses fetched successfully.")


class TeacherAssignmentListCreateView(TeacherBaseAPIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        teacher = self.get_teacher()
        return Assignment.objects.select_related(
            "course__teacher__user",
            "created_by__user",
        ).filter(created_by=teacher)

    def get(self, request):
        assignments = self.get_queryset()
        return self.paginate(
            assignments,
            TeacherAssignmentSerializer,
            "Teacher assignments fetched successfully.",
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )

    def post(self, request):
        teacher = self.get_teacher()
        serializer = TeacherAssignmentSerializer(
            data=request.data,
            context={"teacher": teacher, "teacher_courses": self.get_teacher_courses()},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response(
            "Assignment created successfully.",
            {"assignment": TeacherAssignmentSerializer(assignment, context={"teacher": teacher, "teacher_courses": self.get_teacher_courses()}).data},
            status_code=status.HTTP_201_CREATED,
        )


class TeacherAssignmentDetailView(TeacherBaseAPIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_object(self, assignment_id):
        return get_object_or_404(
            Assignment.objects.select_related("course__teacher__user", "created_by__user"),
            id=assignment_id,
            created_by=self.get_teacher(),
        )

    def get(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        return success_response(
            "Assignment fetched successfully.",
            {
                "assignment": TeacherAssignmentSerializer(
                    assignment,
                    context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
                ).data,
            },
        )

    def put(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        serializer = TeacherAssignmentSerializer(
            assignment,
            data=request.data,
            partial=False,
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response(
            "Assignment updated successfully.",
            {"assignment": TeacherAssignmentSerializer(assignment, context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()}).data},
        )

    def patch(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        serializer = TeacherAssignmentSerializer(
            assignment,
            data=request.data,
            partial=True,
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response(
            "Assignment updated successfully.",
            {"assignment": TeacherAssignmentSerializer(assignment, context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()}).data},
        )

    def delete(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        assignment.delete()
        return success_response("Assignment deleted successfully.")


class TeacherSubmissionListView(TeacherBaseAPIView):
    def get_queryset(self):
        teacher = self.get_teacher()
        queryset = (
            Submission.objects.select_related(
                "assignment__course",
                "student__user",
            )
            .annotate(
                grade_id=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("id")[:1],
                ),
                grade_marks=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("marks")[:1],
                ),
                grade_feedback=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("feedback")[:1],
                ),
            )
            .filter(assignment__course__teacher=teacher)
        )

        course = self.request.query_params.get("course")
        assignment = self.request.query_params.get("assignment")
        status_value = self.request.query_params.get("status")

        if course:
            if course.isdigit():
                queryset = queryset.filter(assignment__course_id=course)
            else:
                queryset = queryset.filter(assignment__course__course_code=course)

        if assignment:
            if assignment.isdigit():
                queryset = queryset.filter(assignment_id=assignment)
            else:
                queryset = queryset.filter(assignment__title__icontains=assignment)

        if status_value:
            queryset = queryset.filter(status=status_value)

        return queryset

    def get(self, request):
        return self.paginate(
            self.get_queryset(),
            TeacherSubmissionSerializer,
            "Teacher submissions fetched successfully.",
        )


class TeacherSubmissionDetailView(TeacherBaseAPIView):
    def get_object(self, submission_id):
        return get_object_or_404(
            Submission.objects.select_related(
                "assignment__course",
                "student__user",
            ).annotate(
                grade_id=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("id")[:1],
                ),
                grade_marks=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("marks")[:1],
                ),
                grade_feedback=Subquery(
                    Grade.objects.filter(
                        student=OuterRef("student"),
                        assignment=OuterRef("assignment"),
                    ).values("feedback")[:1],
                ),
            ),
            id=submission_id,
            assignment__course__teacher=self.get_teacher(),
        )

    def get(self, request, submission_id):
        submission = self.get_object(submission_id)
        return success_response(
            "Submission fetched successfully.",
            {"submission": TeacherSubmissionSerializer(submission).data},
        )


class TeacherSubmissionGradeView(TeacherBaseAPIView):
    def get_submission(self, submission_id):
        return get_object_or_404(
            Submission.objects.select_related("assignment__course", "student__user"),
            id=submission_id,
            assignment__course__teacher=self.get_teacher(),
        )

    def save_grade(self, request, submission_id):
        submission = self.get_submission(submission_id)
        serializer = TeacherGradeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            grade, created = Grade.objects.update_or_create(
                student=submission.student,
                assignment=submission.assignment,
                defaults={
                    "marks": serializer.validated_data["marks"],
                    "feedback": serializer.validated_data.get("feedback", ""),
                    "graded_by": self.get_teacher(),
                },
            )

        return success_response(
            "Grade saved successfully.",
            {
                "grade": {
                    "id": grade.id,
                    "marks": str(grade.marks),
                    "feedback": grade.feedback,
                    "created": created,
                }
            },
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def post(self, request, submission_id):
        return self.save_grade(request, submission_id)

    def put(self, request, submission_id):
        return self.save_grade(request, submission_id)


class TeacherAttendanceListCreateView(TeacherBaseAPIView):
    def get_queryset(self):
        return Attendance.objects.select_related(
            "student__user",
            "course__teacher__user",
        ).filter(course__teacher=self.get_teacher())

    def get(self, request):
        return self.paginate(
            self.get_queryset(),
            TeacherAttendanceSerializer,
            "Teacher attendance fetched successfully.",
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )

    def post(self, request):
        serializer = TeacherAttendanceSerializer(
            data=request.data,
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )
        serializer.is_valid(raise_exception=True)

        try:
            attendance = serializer.save()
        except IntegrityError as exc:
            raise ValidationError({"detail": "Attendance record already exists for this student, course, and date."}) from exc

        return success_response(
            "Attendance created successfully.",
            {"attendance": TeacherAttendanceSerializer(attendance, context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()}).data},
            status_code=status.HTTP_201_CREATED,
        )


class TeacherAttendanceDetailView(TeacherBaseAPIView):
    def get_object(self, attendance_id):
        return get_object_or_404(
            Attendance.objects.select_related("student__user", "course__teacher__user"),
            id=attendance_id,
            course__teacher=self.get_teacher(),
        )

    def get(self, request, attendance_id):
        attendance = self.get_object(attendance_id)
        return success_response(
            "Attendance fetched successfully.",
            {
                "attendance": TeacherAttendanceSerializer(
                    attendance,
                    context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
                ).data,
            },
        )

    def put(self, request, attendance_id):
        attendance = self.get_object(attendance_id)
        serializer = TeacherAttendanceSerializer(
            attendance,
            data=request.data,
            context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()},
        )
        serializer.is_valid(raise_exception=True)
        try:
            attendance = serializer.save()
        except IntegrityError as exc:
            raise ValidationError({"detail": "Attendance record already exists for this student, course, and date."}) from exc

        return success_response(
            "Attendance updated successfully.",
            {"attendance": TeacherAttendanceSerializer(attendance, context={"teacher": self.get_teacher(), "teacher_courses": self.get_teacher_courses()}).data},
        )


class TeacherNotificationListView(TeacherBaseAPIView):
    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user).order_by("is_read", "-created_at")
        return self.paginate(notifications, TeacherNotificationSerializer, "Teacher notifications fetched successfully.")

