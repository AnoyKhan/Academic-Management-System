from django.utils import timezone
from rest_framework import serializers

from apps.accounts.models import User
from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.students.models import Student

from .models import Teacher


class TeacherProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = (
            "id",
            "name",
            "email",
            "employee_id",
            "department",
            "designation",
            "joining_date",
            "profile_image",
        )

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if not obj.user.profile_image:
            return None
        if request:
            return request.build_absolute_uri(obj.user.profile_image.url)
        return obj.user.profile_image.url


class TeacherUserBriefSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "name", "email", "role")

    def get_name(self, obj):
        return obj.get_full_name() or obj.username


class TeacherCourseSerializer(serializers.ModelSerializer):
    teacher = TeacherProfileSerializer(read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "course_code",
            "course_name",
            "description",
            "credit",
            "teacher",
            "created_at",
        )


class AssignmentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "course_code", "course_name")


class TeacherAssignmentBriefSerializer(serializers.ModelSerializer):
    course = AssignmentCourseSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = ("id", "title", "course")


class TeacherAssignmentSerializer(serializers.ModelSerializer):
    course = AssignmentCourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        source="course",
        write_only=True,
        queryset=Course.objects.none(),
    )

    class Meta:
        model = Assignment
        fields = (
            "id",
            "title",
            "description",
            "attachment",
            "deadline",
            "course",
            "course_id",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

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
        course = attrs.get("course") or getattr(self.instance, "course", None)
        teacher = self.context["teacher"]
        if course and course.teacher_id != teacher.id:
            raise serializers.ValidationError({"course_id": "You can only use your own courses."})
        return attrs

    def create(self, validated_data):
        teacher = self.context["teacher"]
        return Assignment.objects.create(created_by=teacher, **validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("course", None)
        return super().update(instance, validated_data)


class TeacherStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Student
        fields = ("id", "student_id", "name", "email", "department", "batch", "semester")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class TeacherSubmissionSerializer(serializers.ModelSerializer):
    assignment = TeacherAssignmentBriefSerializer(read_only=True)
    student = TeacherStudentSerializer(read_only=True)
    grade = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = (
            "id",
            "assignment",
            "student",
            "submitted_file",
            "submission_date",
            "status",
            "grade",
        )

    def get_grade(self, obj):
        grade_id = getattr(obj, "grade_id", None)
        if not grade_id:
            return None
        return {
            "id": grade_id,
            "marks": getattr(obj, "grade_marks", None),
            "feedback": getattr(obj, "grade_feedback", ""),
        }


class TeacherGradeSerializer(serializers.Serializer):
    marks = serializers.DecimalField(max_digits=5, decimal_places=2)
    feedback = serializers.CharField(required=False, allow_blank=True)

    def validate_marks(self, value):
        if value > 100:
            raise serializers.ValidationError("Marks cannot exceed 100.")
        if value < 0:
            raise serializers.ValidationError("Marks must be zero or greater.")
        return value


class TeacherAttendanceSerializer(serializers.ModelSerializer):
    student = TeacherStudentSerializer(read_only=True)
    course = AssignmentCourseSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        source="student",
        write_only=True,
        queryset=Student.objects.none(),
    )
    course_id = serializers.PrimaryKeyRelatedField(
        source="course",
        write_only=True,
        queryset=Course.objects.none(),
    )

    class Meta:
        model = Attendance
        fields = (
            "id",
            "student",
            "course",
            "student_id",
            "course_id",
            "date",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        teacher_courses = self.context.get("teacher_courses")
        if teacher_courses is not None:
            self.fields["course_id"].queryset = teacher_courses
        self.fields["student_id"].queryset = Student.objects.select_related("user")

    def validate(self, attrs):
        course = attrs.get("course") or getattr(self.instance, "course", None)
        teacher = self.context["teacher"]
        if course and course.teacher_id != teacher.id:
            raise serializers.ValidationError({"course_id": "You can only manage attendance for your own courses."})
        return attrs

    def create(self, validated_data):
        return Attendance.objects.create(**validated_data)


class TeacherNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "message", "is_read", "created_at")
