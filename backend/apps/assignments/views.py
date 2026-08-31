from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin, IsStudent, IsTeacher
from apps.assignments.models import Assignment, Submission
from apps.courses.models import Course
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher

from .serializers import AssignmentSerializer, AssignmentWriteSerializer, SubmissionSerializer


class AssignmentBaseAPIView(APIView):
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


class AssignmentListView(AssignmentBaseAPIView):
    def get_queryset(self):
        user = self.request.user
        if user.role == "ADMIN":
            return Assignment.objects.select_related("course", "created_by__user").all()
        if user.role == "TEACHER":
            teacher = self.get_teacher()
            return Assignment.objects.select_related("course", "created_by__user").filter(created_by=teacher)

        student = self.get_student()
        return (
            Assignment.objects.select_related("course", "created_by__user")
            .filter(
                course__in=Course.objects.filter(
                    Q(attendance_records__student=student)
                    | Q(assignments__submissions__student=student)
                    | Q(assignments__grades__student=student)
                ).distinct()
            )
            .distinct()
            .order_by("-deadline")
        )

    def get(self, request):
        queryset = self.get_queryset()
        return self.paginate(
            queryset,
            AssignmentSerializer,
            "Assignments fetched successfully.",
            context={"request": request},
        )

    def post(self, request):
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response(
                "You do not have permission to create assignments.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        teacher = self.get_teacher() if request.user.role == "TEACHER" else None
        course_id = request.data.get("course_id")
        if not course_id:
            return success_response(
                "A course_id is required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        course = get_object_or_404(Course.objects.select_related("teacher"), id=course_id)
        if teacher is None:
            teacher = course.teacher
        elif course.teacher_id != teacher.id:
            return success_response(
                "You can only create assignments for your own course.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        serializer = AssignmentWriteSerializer(
            data=request.data,
            context={
                "teacher": teacher,
                "teacher_courses": Course.objects.filter(teacher=teacher),
            },
        )
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response(
            "Assignment created successfully.",
            {"assignment": AssignmentSerializer(assignment, context={"request": request}).data},
            status_code=status.HTTP_201_CREATED,
        )


class AssignmentDetailView(AssignmentBaseAPIView):
    def get_object(self, assignment_id):
        return get_object_or_404(
            Assignment.objects.select_related("course", "created_by__user"),
            id=assignment_id,
        )

    def get(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        if request.user.role == "ADMIN":
            return success_response("Assignment fetched successfully.", {"assignment": AssignmentSerializer(assignment, context={"request": request}).data})
        if request.user.role == "TEACHER":
            teacher = self.get_teacher()
            if assignment.created_by_id != teacher.id:
                return success_response("You can only view your own assignments.", status_code=status.HTTP_403_FORBIDDEN)
            return success_response("Assignment fetched successfully.", {"assignment": AssignmentSerializer(assignment, context={"request": request}).data})

        student = self.get_student()
        allowed = Assignment.objects.filter(
            id=assignment.id,
            course__in=Course.objects.filter(
                Q(attendance_records__student=student)
                | Q(assignments__submissions__student=student)
                | Q(assignments__grades__student=student)
            ).distinct(),
        ).exists()
        if not allowed:
            return success_response("You are not enrolled in this course.", status_code=status.HTTP_403_FORBIDDEN)
        return success_response("Assignment fetched successfully.", {"assignment": AssignmentSerializer(assignment, context={"request": request}).data})

    def put(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response("You do not have permission to update assignments.", status_code=status.HTTP_403_FORBIDDEN)
        if request.user.role == "TEACHER":
            teacher = self.get_teacher()
            if assignment.created_by_id != teacher.id:
                return success_response("You can only update your own assignments.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = AssignmentWriteSerializer(
            assignment,
            data=request.data,
            partial=True,
            context={"teacher": assignment.created_by, "teacher_courses": Course.objects.filter(teacher=assignment.created_by)},
        )
        serializer.is_valid(raise_exception=True)
        updated = serializer.save()
        return success_response("Assignment updated successfully.", {"assignment": AssignmentSerializer(updated, context={"request": request}).data})

    def delete(self, request, assignment_id):
        assignment = self.get_object(assignment_id)
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response("You do not have permission to delete assignments.", status_code=status.HTTP_403_FORBIDDEN)
        if request.user.role == "TEACHER":
            teacher = self.get_teacher()
            if assignment.created_by_id != teacher.id:
                return success_response("You can only delete your own assignments.", status_code=status.HTTP_403_FORBIDDEN)
        assignment.delete()
        return success_response("Assignment deleted successfully.")


class SubmissionListView(AssignmentBaseAPIView):
    def get(self, request):
        if request.user.role == "STUDENT":
            student = self.get_student()
            queryset = Submission.objects.select_related("assignment__course", "student__user").filter(student=student).order_by("-submission_date")
        elif request.user.role == "TEACHER":
            teacher = self.get_teacher()
            queryset = Submission.objects.select_related("assignment__course", "student__user").filter(assignment__course__teacher=teacher).order_by("-submission_date")
        else:
            queryset = Submission.objects.select_related("assignment__course", "student__user").all().order_by("-submission_date")
        return self.paginate(queryset, SubmissionSerializer, "Submissions fetched successfully.", context={"request": request})


class SubmissionDetailView(AssignmentBaseAPIView):
    def get_object(self, submission_id):
        return get_object_or_404(Submission.objects.select_related("assignment__course", "student__user"), id=submission_id)

    def get(self, request, submission_id):
        submission = self.get_object(submission_id)
        if request.user.role == "STUDENT":
            student = self.get_student()
            if submission.student_id != student.id:
                return success_response("You can only view your own submissions.", status_code=status.HTTP_403_FORBIDDEN)
        elif request.user.role == "TEACHER":
            teacher = self.get_teacher()
            if submission.assignment.course.teacher_id != teacher.id:
                return success_response("You can only view submissions for your own courses.", status_code=status.HTTP_403_FORBIDDEN)
        return success_response("Submission fetched successfully.", {"submission": SubmissionSerializer(submission, context={"request": request}).data})
