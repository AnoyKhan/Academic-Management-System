from rest_framework import serializers

from apps.assignments.models import Assignment
from apps.grades.models import Grade
from apps.students.models import Student
from apps.teachers.models import Teacher


class GradeStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ("id", "student_id", "name", "department", "batch", "semester")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class GradeTeacherSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ("id", "employee_id", "name", "department", "designation")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class GradeSerializer(serializers.ModelSerializer):
    student = GradeStudentSerializer(read_only=True)
    assignment = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()
    graded_by = GradeTeacherSerializer(read_only=True)

    class Meta:
        model = Grade
        fields = (
            "id",
            "student",
            "assignment",
            "course",
            "marks",
            "feedback",
            "graded_by",
            "created_at",
        )

    def get_assignment(self, obj):
        return {"id": obj.assignment.id, "title": obj.assignment.title}

    def get_course(self, obj):
        return {"id": obj.assignment.course.id, "course_code": obj.assignment.course.course_code, "course_name": obj.assignment.course.course_name}


class GradeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ("student_id", "assignment_id", "marks", "feedback", "graded_by_id")

    def validate_marks(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Marks must be between 0 and 100.")
        return value
