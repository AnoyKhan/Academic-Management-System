from rest_framework import serializers

from apps.courses.models import Course
from apps.students.models import Student
from apps.teachers.models import Teacher


class CourseTeacherSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Teacher
        fields = (
            "id",
            "employee_id",
            "name",
            "email",
            "department",
            "designation",
        )

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class CourseSerializer(serializers.ModelSerializer):
    teacher = CourseTeacherSerializer(read_only=True)

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


class CourseWriteSerializer(serializers.ModelSerializer):
    teacher_id = serializers.PrimaryKeyRelatedField(
        source="teacher",
        queryset=Teacher.objects.all(),
        required=False,
    )

    class Meta:
        model = Course
        fields = (
            "id",
            "course_code",
            "course_name",
            "description",
            "credit",
            "teacher_id",
        )
        read_only_fields = ("id",)

    def validate_course_code(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Course code is required.")
        return value

    def validate(self, attrs):
        teacher = self.context.get("teacher")
        selected_teacher = attrs.get("teacher")
        if teacher and selected_teacher and selected_teacher.id != teacher.id:
            raise serializers.ValidationError({
                "teacher_id": "You can only assign courses to your own teacher profile.",
            })
        return attrs

    def create(self, validated_data):
        teacher = self.context.get("teacher")
        if teacher and "teacher" not in validated_data:
            validated_data["teacher"] = teacher
        return super().create(validated_data)
