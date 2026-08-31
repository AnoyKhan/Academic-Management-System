from django.utils import timezone
from rest_framework import serializers

from apps.assignments.models import Assignment, Submission
from apps.courses.models import Course
from apps.students.models import Student
from apps.teachers.models import Teacher


class AssignmentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "course_code", "course_name")


class AssignmentTeacherSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ("id", "employee_id", "name", "department", "designation")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class AssignmentSerializer(serializers.ModelSerializer):
    course = AssignmentCourseSerializer(read_only=True)
    created_by = AssignmentTeacherSerializer(read_only=True)
    attachment = serializers.SerializerMethodField()
    submission_count = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "attachment",
            "course",
            "created_by",
            "submission_count",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def get_attachment(self, obj):
        if not obj.attachment:
            return None
        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(obj.attachment.url)
        return obj.attachment.url

    def get_submission_count(self, obj):
        return obj.submissions.count()


class SubmissionStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ("id", "student_id", "name", "department", "batch", "semester")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class SubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    student = SubmissionStudentSerializer(read_only=True)
    submitted_file = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = (
            "id",
            "assignment",
            "student",
            "submitted_file",
            "submission_date",
            "status",
        )

    def get_submitted_file(self, obj):
        if not obj.submitted_file:
            return None
        request = self.context.get("request")
        if request is not None:
            return request.build_absolute_uri(obj.submitted_file.url)
        return obj.submitted_file.url


class AssignmentWriteSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        source="course",
        queryset=Course.objects.none(),
    )

    class Meta:
        model = Assignment
        fields = (
            "id",
            "title",
            "description",
            "deadline",
            "attachment",
            "course_id",
        )
        read_only_fields = ("id",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        teacher_courses = self.context.get("teacher_courses")
        if teacher_courses is not None:
            self.fields["course_id"].queryset = teacher_courses

    def validate_deadline(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Deadline must be in the future.")
        return value

    def validate(self, attrs):
        teacher = self.context.get("teacher")
        course = attrs.get("course") or getattr(self.instance, "course", None)
        if teacher and course and course.teacher_id != teacher.id:
            raise serializers.ValidationError({
                "course_id": "You can only create assignments for your own courses.",
            })
        return attrs

    def create(self, validated_data):
        teacher = self.context.get("teacher")
        if teacher is None:
            course = validated_data.get("course")
            if course is not None:
                teacher = course.teacher
        if teacher is None:
            raise serializers.ValidationError({
                "course_id": "A valid course teacher is required to create an assignment.",
            })

        validated_data["created_by"] = teacher
        return Assignment.objects.create(**validated_data)
