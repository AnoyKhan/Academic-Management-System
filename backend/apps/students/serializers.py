from rest_framework import serializers

from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.shared.validators import validate_uploaded_file
from .models import Student


class StudentProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Student
        fields = (
            "student_id",
            "name",
            "email",
            "department",
            "intake",
            "batch",
            "semester",
        )


class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ("course_code", "course_name", "credit", "teacher")

    def get_teacher(self, obj):
        return {
            "id": obj.teacher_id,
            "employee_id": obj.teacher.employee_id,
            "name": obj.teacher.user.get_full_name() or obj.teacher.user.username,
            "department": obj.teacher.department,
            "designation": obj.teacher.designation,
        }


class StudentAssignmentSerializer(serializers.ModelSerializer):
    course = serializers.CharField(source="course.course_name", read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ("id", "title", "course", "description", "deadline", "status")

    def get_status(self, obj):
        student = self.context["student"]
        submissions = getattr(obj, "student_submissions", None)
        if submissions is not None:
            submission = submissions[0] if submissions else None
        else:
            submission = obj.submissions.filter(student=student).first()
        if not submission:
            return Submission.Status.PENDING
        return submission.status


class AssignmentSubmissionSerializer(serializers.Serializer):
    file = serializers.FileField(write_only=True, validators=[validate_uploaded_file])

    def validate(self, attrs):
        assignment = self.context["assignment"]
        student = self.context["student"]

        if Submission.objects.filter(assignment=assignment, student=student).exists():
            raise serializers.ValidationError(
                {"detail": "You have already submitted this assignment."},
            )

        return attrs

    def create(self, validated_data):
        assignment = self.context["assignment"]
        student = self.context["student"]
        status = self.context["submission_status"]

        from django.db import IntegrityError, transaction

        try:
            with transaction.atomic():
                return Submission.objects.create(
                    assignment=assignment,
                    student=student,
                    submitted_file=validated_data["file"],
                    submission_date=self.context["submission_date"],
                    status=status,
                )
        except IntegrityError as exc:
            raise serializers.ValidationError(
                {"detail": "You have already submitted this assignment."},
            ) from exc


class StudentGradeSerializer(serializers.ModelSerializer):
    course = serializers.CharField(
        source="assignment.course.course_name",
        read_only=True,
    )
    assignment = serializers.CharField(source="assignment.title", read_only=True)

    class Meta:
        model = Grade
        fields = ("course", "assignment", "marks", "feedback")


class StudentAttendanceSerializer(serializers.ModelSerializer):
    course = serializers.CharField(source="course.course_name", read_only=True)

    class Meta:
        model = Attendance
        fields = ("course", "date", "status")


class StudentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "message", "is_read", "created_at")
