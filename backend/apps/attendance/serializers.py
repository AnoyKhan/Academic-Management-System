from rest_framework import serializers

from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.students.models import Student


class AttendanceStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ("id", "student_id", "name", "department", "batch", "semester")

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username


class AttendanceCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "course_code", "course_name")


class AttendanceSerializer(serializers.ModelSerializer):
    student = AttendanceStudentSerializer(read_only=True)
    course = AttendanceCourseSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(source="student", queryset=Student.objects.none(), write_only=True)
    course_id = serializers.PrimaryKeyRelatedField(source="course", queryset=Course.objects.none(), write_only=True)

    class Meta:
        model = Attendance
        fields = ("id", "student", "course", "student_id", "course_id", "date", "status", "created_at")
        read_only_fields = ("id", "created_at")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        teacher = self.context.get("teacher")
        if teacher is not None:
            self.fields["course_id"].queryset = Course.objects.filter(teacher=teacher)
        else:
            self.fields["course_id"].queryset = Course.objects.all()
        self.fields["student_id"].queryset = Student.objects.select_related("user")
