from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.assignments.models import Assignment
from apps.grades.models import Grade
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher

from .serializers import GradeSerializer, GradeWriteSerializer


class GradeBaseAPIView(APIView):
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


class GradeListView(GradeBaseAPIView):
    def get(self, request):
        if request.user.role == "STUDENT":
            queryset = Grade.objects.select_related("student__user", "assignment__course", "graded_by__user").filter(student=self.get_student())
        elif request.user.role == "TEACHER":
            teacher = self.get_teacher()
            queryset = Grade.objects.select_related("student__user", "assignment__course", "graded_by__user").filter(assignment__course__teacher=teacher)
        else:
            queryset = Grade.objects.select_related("student__user", "assignment__course", "graded_by__user").all()
        return self.paginate(queryset.order_by("-created_at"), GradeSerializer, "Grades fetched successfully.")

    def post(self, request):
        if request.user.role not in {"ADMIN", "TEACHER"}:
            return success_response("You do not have permission to create grades.", status_code=status.HTTP_403_FORBIDDEN)

        serializer = GradeWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = get_object_or_404(Student.objects.select_related("user"), id=serializer.validated_data["student_id"])
        assignment = get_object_or_404(Assignment.objects.select_related("course"), id=serializer.validated_data["assignment_id"])
        teacher = self.get_teacher() if request.user.role == "TEACHER" else get_object_or_404(Teacher.objects.select_related("user"), id=serializer.validated_data["graded_by_id"])

        if request.user.role == "TEACHER" and assignment.course.teacher_id != teacher.id:
            return success_response("You can only grade submissions for your own courses.", status_code=status.HTTP_403_FORBIDDEN)

        grade, created = Grade.objects.update_or_create(
            student=student,
            assignment=assignment,
            defaults={
                "marks": serializer.validated_data["marks"],
                "feedback": serializer.validated_data.get("feedback", ""),
                "graded_by": teacher,
            },
        )
        message = "Grade created successfully." if created else "Grade updated successfully."
        return success_response(message, {"grade": GradeSerializer(grade).data}, status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
