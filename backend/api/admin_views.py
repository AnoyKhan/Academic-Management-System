from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.permissions import IsAdmin
from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.shared.pagination import StandardPageNumberPagination
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=False,
        trim_whitespace=False,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "is_active",
            "name",
            "status",
            "created_at",
            "updated_at",
            "password",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_status(self, obj):
        return "Active" if obj.is_active else "Inactive"

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AdminStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = (
            "id",
            "student_id",
            "name",
            "email",
            "department",
            "intake",
            "batch",
            "semester",
            "date_of_birth",
            "address",
            "status",
        )

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_status(self, obj):
        return "Active" if obj.user.is_active else "Inactive"


class AdminTeacherSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    course_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = (
            "id",
            "employee_id",
            "name",
            "email",
            "department",
            "designation",
            "joining_date",
            "course_count",
            "status",
        )

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def get_course_count(self, obj):
        return obj.courses.count()

    def get_status(self, obj):
        return "Active" if obj.user.is_active else "Inactive"


class AdminCourseSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = (
            "id",
            "course_code",
            "course_name",
            "description",
            "credit",
            "teacher",
            "status",
            "created_at",
        )

    def get_teacher(self, obj):
        return {
            "id": obj.teacher_id,
            "employee_id": obj.teacher.employee_id,
            "name": obj.teacher.user.get_full_name() or obj.teacher.user.username,
            "department": obj.teacher.department,
        }

    def get_status(self, obj):
        return "Running" if obj.assignments.exists() else "Open"


class AdminAssignmentSerializer(serializers.ModelSerializer):
    course = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
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
            "teacher",
            "submission_count",
            "created_at",
        )

    def get_course(self, obj):
        return {
            "id": obj.course.id,
            "course_code": obj.course.course_code,
            "course_name": obj.course.course_name,
        }

    def get_teacher(self, obj):
        return {
            "id": obj.created_by.id,
            "name": obj.created_by.user.get_full_name() or obj.created_by.user.username,
            "employee_id": obj.created_by.employee_id,
        }

    def get_submission_count(self, obj):
        return obj.submissions.count()


class AdminCourseWriteSerializer(serializers.ModelSerializer):
    teacher_id = serializers.PrimaryKeyRelatedField(
        source="teacher",
        queryset=Teacher.objects.select_related("user"),
    )

    class Meta:
        model = Course
        fields = ("course_code", "course_name", "description", "credit", "teacher_id")


class AdminAssignmentWriteSerializer(serializers.ModelSerializer):
    course_id = serializers.PrimaryKeyRelatedField(
        source="course",
        queryset=Course.objects.select_related("teacher"),
    )
    teacher_id = serializers.PrimaryKeyRelatedField(
        source="created_by",
        queryset=Teacher.objects.select_related("user"),
        required=False,
    )

    class Meta:
        model = Assignment
        fields = ("title", "description", "deadline", "attachment", "course_id", "teacher_id")

    def validate_deadline(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Deadline must be in the future.")
        return value

    def validate(self, attrs):
        course = attrs.get("course") or getattr(self.instance, "course", None)
        teacher = attrs.get("created_by") or getattr(self.instance, "created_by", None)
        if teacher is None and course is not None:
            attrs["created_by"] = course.teacher
            teacher = course.teacher
        if course is not None and teacher is not None and course.teacher_id != teacher.id:
            raise serializers.ValidationError({"teacher_id": "The selected teacher must teach the selected course."})
        return attrs


class AdminGradeSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    assignment = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()
    graded_by = serializers.SerializerMethodField()

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

    def get_student(self, obj):
        return {
            "id": obj.student.id,
            "student_id": obj.student.student_id,
            "name": obj.student.user.get_full_name() or obj.student.user.username,
        }

    def get_assignment(self, obj):
        return {
            "id": obj.assignment.id,
            "title": obj.assignment.title,
        }

    def get_course(self, obj):
        return {
            "id": obj.assignment.course.id,
            "course_code": obj.assignment.course.course_code,
            "course_name": obj.assignment.course.course_name,
        }

    def get_graded_by(self, obj):
        return {
            "id": obj.graded_by.id,
            "name": obj.graded_by.user.get_full_name() or obj.graded_by.user.username,
            "employee_id": obj.graded_by.employee_id,
        }


class AdminGradeWriteSerializer(serializers.ModelSerializer):
    student_id = serializers.PrimaryKeyRelatedField(
        source="student", queryset=Student.objects.select_related("user")
    )
    assignment_id = serializers.PrimaryKeyRelatedField(
        source="assignment", queryset=Assignment.objects.select_related("course")
    )
    graded_by_id = serializers.PrimaryKeyRelatedField(
        source="graded_by", queryset=Teacher.objects.select_related("user")
    )

    class Meta:
        model = Grade
        fields = ("student_id", "assignment_id", "marks", "feedback", "graded_by_id")
        extra_kwargs = {"feedback": {"required": False, "allow_blank": True}}

    def validate(self, attrs):
        student = attrs.get("student", getattr(self.instance, "student", None))
        assignment = attrs.get("assignment", getattr(self.instance, "assignment", None))
        duplicate = Grade.objects.filter(student=student, assignment=assignment)
        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)
        if duplicate.exists():
            raise serializers.ValidationError(
                {"assignment_id": "This student already has a grade for this assignment."}
            )
        return attrs


class AdminAttendanceSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ("id", "student", "course", "date", "status", "created_at")

    def get_student(self, obj):
        return {
            "id": obj.student.id,
            "student_id": obj.student.student_id,
            "name": obj.student.user.get_full_name() or obj.student.user.username,
        }

    def get_course(self, obj):
        return {
            "id": obj.course.id,
            "course_code": obj.course.course_code,
            "course_name": obj.course.course_name,
        }


class AdminAttendanceWriteSerializer(serializers.ModelSerializer):
    student_id = serializers.PrimaryKeyRelatedField(
        source="student", queryset=Student.objects.select_related("user")
    )
    course_id = serializers.PrimaryKeyRelatedField(
        source="course", queryset=Course.objects.select_related("teacher")
    )

    class Meta:
        model = Attendance
        fields = ("student_id", "course_id", "date", "status")

    def validate(self, attrs):
        student = attrs.get("student", getattr(self.instance, "student", None))
        course = attrs.get("course", getattr(self.instance, "course", None))
        date = attrs.get("date", getattr(self.instance, "date", None))
        duplicate = Attendance.objects.filter(student=student, course=course, date=date)
        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)
        if duplicate.exists():
            raise serializers.ValidationError(
                {"date": "This student already has attendance for this course and date."}
            )
        return attrs


class AdminNotificationSerializer(serializers.ModelSerializer):
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "receiver", "title", "message", "is_read", "created_at")

    def get_receiver(self, obj):
        return {
            "id": obj.receiver.id,
            "name": obj.receiver.get_full_name() or obj.receiver.username,
            "email": obj.receiver.email,
            "role": obj.receiver.role,
        }


class AdminNotificationWriteSerializer(serializers.ModelSerializer):
    receiver_id = serializers.PrimaryKeyRelatedField(
        source="receiver", queryset=User.objects.all()
    )

    class Meta:
        model = Notification
        fields = ("receiver_id", "title", "message", "is_read")


class AdminBaseAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def paginate(self, queryset, serializer_class, message, request=None, many=True):
        paginator = StandardPageNumberPagination()
        data = paginator.paginate_queryset(queryset, request or self.request, view=self)
        serializer = serializer_class(data, many=many)
        return paginator.get_paginated_response(serializer.data, message=message)


class AdminDashboardView(AdminBaseAPIView):
    def get(self, request):
        user_queryset = User.objects.all()
        stats = {
            "users": user_queryset.count(),
            "students": Student.objects.count(),
            "teachers": Teacher.objects.count(),
            "courses": Course.objects.count(),
            "assignments": Assignment.objects.count(),
            "submissions": Submission.objects.count(),
            "attendance_records": Attendance.objects.count(),
            "grades": Grade.objects.count(),
            "total_users": user_queryset.count(),
            "total_students": Student.objects.count(),
            "total_teachers": Teacher.objects.count(),
            "total_courses": Course.objects.count(),
            "total_assignments": Assignment.objects.count(),
            "total_submissions": Submission.objects.count(),
            "total_attendance_records": Attendance.objects.count(),
            "total_grades": Grade.objects.count(),
        }

        recent_users = user_queryset.order_by("-created_at")[:5]
        recent_courses = Course.objects.select_related("teacher__user").order_by("-created_at")[:5]
        recent_notifications = Notification.objects.select_related("receiver").order_by("-created_at")[:5]

        return success_response(
            "Admin dashboard fetched successfully.",
            {
                "stats": stats,
                "recent_users": AdminUserSerializer(recent_users, many=True).data,
                "recent_courses": AdminCourseSerializer(recent_courses, many=True).data,
                "recent_notifications": AdminNotificationSerializer(recent_notifications, many=True).data,
            },
        )


class AdminUserListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = User.objects.all()
        search = request.query_params.get("search", "").strip()
        role = request.query_params.get("role")
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search)
                | Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )
        if role:
            queryset = queryset.filter(role=role)

        return self.paginate(queryset.order_by("-created_at"), AdminUserSerializer, "Users fetched successfully.")

    def post(self, request):
        serializer = AdminUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success_response(
            "User created successfully.",
            {"user": AdminUserSerializer(user).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminUserDetailView(AdminBaseAPIView):
    def get(self, request, user_id):
        user = get_object_or_404(User.objects.all(), id=user_id)
        return success_response("User fetched successfully.", {"user": AdminUserSerializer(user).data})

    def put(self, request, user_id):
        user = get_object_or_404(User.objects.all(), id=user_id)
        serializer = AdminUserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success_response("User updated successfully.", {"user": AdminUserSerializer(user).data})

    def patch(self, request, user_id):
        user = get_object_or_404(User.objects.all(), id=user_id)
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return success_response("User updated successfully.", {"user": AdminUserSerializer(user).data})

    def delete(self, request, user_id):
        user = get_object_or_404(User.objects.all(), id=user_id)
        if user.role == User.Role.ADMIN and User.objects.filter(role=User.Role.ADMIN).count() <= 1:
            return success_response("The last admin account cannot be deleted.", status_code=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return success_response("User deleted successfully.")


class AdminStudentListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Student.objects.select_related("user").order_by("student_id", "id")
        search = request.query_params.get("search", "").strip()
        department = request.query_params.get("department", "").strip()
        status_value = request.query_params.get("status", "").strip()
        if search:
            queryset = queryset.filter(
                Q(student_id__icontains=search)
                | Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
                | Q(department__icontains=search)
            )
        if department:
            queryset = queryset.filter(department=department)
        if status_value in {"Active", "Inactive"}:
            queryset = queryset.filter(user__is_active=status_value == "Active")
        return self.paginate(queryset, AdminStudentSerializer, "Students fetched successfully.")

    @transaction.atomic
    def post(self, request):
        user_id = request.data.get("user_id")
        if user_id:
            user = get_object_or_404(User.objects.all(), id=user_id)
            if user.role != User.Role.STUDENT:
                return success_response("Selected user must have STUDENT role.", status_code=status.HTTP_400_BAD_REQUEST)
        else:
            username = request.data.get("username") or f"student-{User.objects.count() + 1}"
            email = request.data.get("email")
            password = request.data.get("password") or "StrongPass123!"
            if not email:
                return success_response("Email is required.", status_code=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email__iexact=email).exists():
                return success_response("A user with this email already exists.", status_code=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=username).exists():
                return success_response("A user with this username already exists.", status_code=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=request.data.get("first_name", ""),
                last_name=request.data.get("last_name", ""),
                phone=request.data.get("phone", ""),
                role=User.Role.STUDENT,
            )

        if Student.objects.filter(user=user).exists():
            return success_response("Student profile already exists for this user.", status_code=status.HTTP_400_BAD_REQUEST)

        student_id = request.data.get("student_id") or f"STU-{user.id:05d}"
        if Student.objects.filter(student_id=student_id).exists():
            return success_response("A student with this ID already exists.", status_code=status.HTTP_400_BAD_REQUEST)
        student = Student.objects.create(
            user=user,
            student_id=student_id,
            department=request.data.get("department", "General"),
            intake=request.data.get("intake", "2024"),
            batch=request.data.get("batch", "A"),
            semester=request.data.get("semester", 1),
            date_of_birth=request.data.get("date_of_birth"),
            address=request.data.get("address", ""),
        )
        return success_response(
            "Student created successfully.",
            {"student": AdminStudentSerializer(student).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminStudentDetailView(AdminBaseAPIView):
    def get(self, request, student_id):
        student = get_object_or_404(Student.objects.select_related("user"), id=student_id)
        return success_response("Student fetched successfully.", {"student": AdminStudentSerializer(student).data})

    def put(self, request, student_id):
        student = get_object_or_404(Student.objects.select_related("user"), id=student_id)
        user = student.user
        if request.data.get("email"):
            user.email = request.data["email"]
        if request.data.get("username"):
            user.username = request.data["username"]
        if request.data.get("first_name") is not None:
            user.first_name = request.data["first_name"]
        if request.data.get("last_name") is not None:
            user.last_name = request.data["last_name"]
        if request.data.get("phone") is not None:
            user.phone = request.data["phone"]
        if request.data.get("is_active") is not None:
            user.is_active = request.data["is_active"]
        user.save()

        if request.data.get("student_id"):
            student.student_id = request.data["student_id"]
        if request.data.get("department") is not None:
            student.department = request.data["department"]
        if request.data.get("intake") is not None:
            student.intake = request.data["intake"]
        if request.data.get("batch") is not None:
            student.batch = request.data["batch"]
        if request.data.get("semester") is not None:
            student.semester = request.data["semester"]
        if request.data.get("date_of_birth") is not None:
            student.date_of_birth = request.data["date_of_birth"]
        if request.data.get("address") is not None:
            student.address = request.data["address"]
        student.save()
        return success_response("Student updated successfully.", {"student": AdminStudentSerializer(student).data})

    def delete(self, request, student_id):
        student = get_object_or_404(Student.objects.select_related("user"), id=student_id)
        user = student.user
        student.delete()
        if user and User.objects.filter(id=user.id).exists():
            user.delete()
        return success_response("Student deleted successfully.")


class AdminTeacherListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Teacher.objects.select_related("user").order_by("employee_id", "id")
        search = request.query_params.get("search", "").strip()
        department = request.query_params.get("department", "").strip()
        designation = request.query_params.get("designation", "").strip()
        status_value = request.query_params.get("status", "").strip()
        if search:
            queryset = queryset.filter(
                Q(employee_id__icontains=search)
                | Q(department__icontains=search)
                | Q(designation__icontains=search)
                | Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
            )
        if department:
            queryset = queryset.filter(department__iexact=department)
        if designation:
            queryset = queryset.filter(designation__iexact=designation)
        if status_value in {"Active", "Inactive"}:
            queryset = queryset.filter(user__is_active=status_value == "Active")
        return self.paginate(queryset, AdminTeacherSerializer, "Teachers fetched successfully.")

    @transaction.atomic
    def post(self, request):
        user_id = request.data.get("user_id")
        if user_id:
            user = get_object_or_404(User.objects.all(), id=user_id)
            if user.role != User.Role.TEACHER:
                return success_response("Selected user must have TEACHER role.", status_code=status.HTTP_400_BAD_REQUEST)
        else:
            username = request.data.get("username") or f"teacher-{User.objects.count() + 1}"
            email = request.data.get("email")
            password = request.data.get("password") or "StrongPass123!"
            if not email:
                return success_response("Email is required.", status_code=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email__iexact=email).exists():
                return success_response("A user with this email already exists.", status_code=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=username).exists():
                return success_response("A user with this username already exists.", status_code=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=request.data.get("first_name", ""),
                last_name=request.data.get("last_name", ""),
                phone=request.data.get("phone", ""),
                role=User.Role.TEACHER,
            )

        if Teacher.objects.filter(user=user).exists():
            return success_response("Teacher profile already exists for this user.", status_code=status.HTTP_400_BAD_REQUEST)

        employee_id = request.data.get("employee_id") or f"EMP-{user.id:05d}"
        if Teacher.objects.filter(employee_id=employee_id).exists():
            return success_response("A teacher with this employee ID already exists.", status_code=status.HTTP_400_BAD_REQUEST)
        teacher = Teacher.objects.create(
            user=user,
            employee_id=employee_id,
            department=request.data.get("department", "General"),
            designation=request.data.get("designation", "Lecturer"),
            joining_date=request.data.get("joining_date"),
        )
        return success_response(
            "Teacher created successfully.",
            {"teacher": AdminTeacherSerializer(teacher).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminTeacherDetailView(AdminBaseAPIView):
    def get(self, request, teacher_id):
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=teacher_id)
        return success_response("Teacher fetched successfully.", {"teacher": AdminTeacherSerializer(teacher).data})

    def put(self, request, teacher_id):
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=teacher_id)
        user = teacher.user
        if request.data.get("email"):
            user.email = request.data["email"]
        if request.data.get("username"):
            user.username = request.data["username"]
        if request.data.get("first_name") is not None:
            user.first_name = request.data["first_name"]
        if request.data.get("last_name") is not None:
            user.last_name = request.data["last_name"]
        if request.data.get("phone") is not None:
            user.phone = request.data["phone"]
        if request.data.get("is_active") is not None:
            user.is_active = request.data["is_active"]
        user.save()

        if request.data.get("employee_id"):
            teacher.employee_id = request.data["employee_id"]
        if request.data.get("department") is not None:
            teacher.department = request.data["department"]
        if request.data.get("designation") is not None:
            teacher.designation = request.data["designation"]
        if request.data.get("joining_date") is not None:
            teacher.joining_date = request.data["joining_date"]
        teacher.save()
        return success_response("Teacher updated successfully.", {"teacher": AdminTeacherSerializer(teacher).data})

    def delete(self, request, teacher_id):
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=teacher_id)
        user = teacher.user
        teacher.delete()
        if user and User.objects.filter(id=user.id).exists():
            user.delete()
        return success_response("Teacher deleted successfully.")


class AdminCourseListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Course.objects.select_related("teacher__user").order_by("course_code", "id")
        search = request.query_params.get("search", "").strip()
        teacher_id = request.query_params.get("teacher_id", "").strip()
        if search:
            queryset = queryset.filter(
                Q(course_code__icontains=search)
                | Q(course_name__icontains=search)
                | Q(description__icontains=search)
                | Q(teacher__employee_id__icontains=search)
                | Q(teacher__department__icontains=search)
                | Q(teacher__user__first_name__icontains=search)
                | Q(teacher__user__last_name__icontains=search)
            )
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        return self.paginate(queryset, AdminCourseSerializer, "Courses fetched successfully.")

    def post(self, request):
        serializer = AdminCourseWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return success_response(
            "Course created successfully.",
            {"course": AdminCourseSerializer(course).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminCourseDetailView(AdminBaseAPIView):
    def get(self, request, course_id):
        course = get_object_or_404(Course.objects.select_related("teacher__user"), id=course_id)
        return success_response("Course fetched successfully.", {"course": AdminCourseSerializer(course).data})

    def put(self, request, course_id):
        course = get_object_or_404(Course.objects.select_related("teacher__user"), id=course_id)
        serializer = AdminCourseWriteSerializer(course, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return success_response("Course updated successfully.", {"course": AdminCourseSerializer(course).data})

    def delete(self, request, course_id):
        course = get_object_or_404(Course.objects.all(), id=course_id)
        course.delete()
        return success_response("Course deleted successfully.")


class AdminAssignmentListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Assignment.objects.select_related("course", "created_by__user").order_by(
            "-deadline", "-id"
        )
        search = request.query_params.get("search", "").strip()
        course_id = request.query_params.get("course_id", "").strip()
        deadline_from = request.query_params.get("deadline_from", "").strip()
        deadline_to = request.query_params.get("deadline_to", "").strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(course__course_code__icontains=search)
                | Q(course__course_name__icontains=search)
            )
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if deadline_from:
            queryset = queryset.filter(deadline__date__gte=deadline_from)
        if deadline_to:
            queryset = queryset.filter(deadline__date__lte=deadline_to)
        return self.paginate(queryset, AdminAssignmentSerializer, "Assignments fetched successfully.")

    def post(self, request):
        serializer = AdminAssignmentWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response(
            "Assignment created successfully.",
            {"assignment": AdminAssignmentSerializer(assignment).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminAssignmentDetailView(AdminBaseAPIView):
    def get(self, request, assignment_id):
        assignment = get_object_or_404(Assignment.objects.select_related("course", "created_by__user"), id=assignment_id)
        return success_response("Assignment fetched successfully.", {"assignment": AdminAssignmentSerializer(assignment).data})

    def put(self, request, assignment_id):
        assignment = get_object_or_404(Assignment.objects.select_related("course", "created_by__user"), id=assignment_id)
        serializer = AdminAssignmentWriteSerializer(assignment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return success_response("Assignment updated successfully.", {"assignment": AdminAssignmentSerializer(assignment).data})

    def delete(self, request, assignment_id):
        assignment = get_object_or_404(Assignment.objects.all(), id=assignment_id)
        assignment.delete()
        return success_response("Assignment deleted successfully.")


class AdminGradeListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Grade.objects.select_related(
            "student__user", "assignment__course", "graded_by__user"
        ).order_by("-created_at", "-id")
        search = request.query_params.get("search", "").strip()
        student_id = request.query_params.get("student_id", "").strip()
        assignment_id = request.query_params.get("assignment_id", "").strip()
        course_id = request.query_params.get("course_id", "").strip()
        if search:
            queryset = queryset.filter(
                Q(student__student_id__icontains=search)
                | Q(student__user__username__icontains=search)
                | Q(student__user__email__icontains=search)
                | Q(student__user__first_name__icontains=search)
                | Q(student__user__last_name__icontains=search)
                | Q(assignment__title__icontains=search)
                | Q(assignment__course__course_code__icontains=search)
                | Q(assignment__course__course_name__icontains=search)
            )
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)
        if course_id:
            queryset = queryset.filter(assignment__course_id=course_id)
        return self.paginate(queryset, AdminGradeSerializer, "Grades fetched successfully.")

    def post(self, request):
        serializer = AdminGradeWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        grade = serializer.save()
        return success_response(
            "Grade recorded successfully.",
            {"grade": AdminGradeSerializer(grade).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminGradeDetailView(AdminBaseAPIView):
    def get_object(self, grade_id):
        return get_object_or_404(
            Grade.objects.select_related("student__user", "assignment__course", "graded_by__user"),
            id=grade_id,
        )

    def get(self, request, grade_id):
        return success_response("Grade fetched successfully.", {"grade": AdminGradeSerializer(self.get_object(grade_id)).data})

    def put(self, request, grade_id):
        return self.update(request, grade_id, partial=False)

    def patch(self, request, grade_id):
        return self.update(request, grade_id, partial=True)

    def update(self, request, grade_id, partial):
        grade = self.get_object(grade_id)
        serializer = AdminGradeWriteSerializer(grade, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        grade = serializer.save()
        return success_response("Grade updated successfully.", {"grade": AdminGradeSerializer(grade).data})

    def delete(self, request, grade_id):
        grade = self.get_object(grade_id)
        grade.delete()
        return success_response("Grade deleted successfully.")


class AdminAttendanceListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Attendance.objects.select_related(
            "student__user", "course__teacher__user"
        ).order_by("-date", "-id")
        search = request.query_params.get("search", "").strip()
        student_id = request.query_params.get("student_id", "").strip()
        course_id = request.query_params.get("course_id", "").strip()
        status_value = request.query_params.get("status", "").strip()
        date_from = request.query_params.get("date_from", "").strip()
        date_to = request.query_params.get("date_to", "").strip()
        if search:
            queryset = queryset.filter(
                Q(student__student_id__icontains=search)
                | Q(student__user__username__icontains=search)
                | Q(student__user__email__icontains=search)
                | Q(student__user__first_name__icontains=search)
                | Q(student__user__last_name__icontains=search)
                | Q(course__course_code__icontains=search)
                | Q(course__course_name__icontains=search)
            )
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        return self.paginate(queryset, AdminAttendanceSerializer, "Attendance fetched successfully.")

    def post(self, request):
        serializer = AdminAttendanceWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        return success_response(
            "Attendance recorded successfully.",
            {"attendance": AdminAttendanceSerializer(attendance).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminAttendanceDetailView(AdminBaseAPIView):
    def get_object(self, attendance_id):
        return get_object_or_404(
            Attendance.objects.select_related("student__user", "course__teacher__user"),
            id=attendance_id,
        )

    def get(self, request, attendance_id):
        return success_response("Attendance fetched successfully.", {"attendance": AdminAttendanceSerializer(self.get_object(attendance_id)).data})

    def put(self, request, attendance_id):
        return self.update(request, attendance_id, partial=False)

    def patch(self, request, attendance_id):
        return self.update(request, attendance_id, partial=True)

    def update(self, request, attendance_id, partial):
        attendance = self.get_object(attendance_id)
        serializer = AdminAttendanceWriteSerializer(attendance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save()
        return success_response("Attendance updated successfully.", {"attendance": AdminAttendanceSerializer(attendance).data})

    def delete(self, request, attendance_id):
        attendance = self.get_object(attendance_id)
        attendance.delete()
        return success_response("Attendance deleted successfully.")


class AdminNotificationListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Notification.objects.select_related("receiver").order_by("-created_at")
        receiver_id = request.query_params.get("receiver_id")
        if receiver_id:
            queryset = queryset.filter(receiver_id=receiver_id)
        return self.paginate(queryset, AdminNotificationSerializer, "Notifications fetched successfully.")

    def post(self, request):
        serializer = AdminNotificationWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        return success_response(
            "Notification created successfully.",
            {"notification": AdminNotificationSerializer(notification).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminNotificationDetailView(AdminBaseAPIView):
    def get_object(self, notification_id):
        return get_object_or_404(Notification.objects.select_related("receiver"), id=notification_id)

    def get(self, request, notification_id):
        return success_response("Notification fetched successfully.", {"notification": AdminNotificationSerializer(self.get_object(notification_id)).data})

    def put(self, request, notification_id):
        return self.update(request, notification_id, partial=False)

    def patch(self, request, notification_id):
        return self.update(request, notification_id, partial=True)

    def update(self, request, notification_id, partial):
        notification = self.get_object(notification_id)
        serializer = AdminNotificationWriteSerializer(notification, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        return success_response("Notification updated successfully.", {"notification": AdminNotificationSerializer(notification).data})

    def delete(self, request, notification_id):
        notification = self.get_object(notification_id)
        notification.delete()
        return success_response("Notification deleted successfully.")


class AdminAnalyticsView(AdminBaseAPIView):
    def get(self, request):
        stats = {
            "total_users": User.objects.count(),
            "total_students": Student.objects.count(),
            "total_teachers": Teacher.objects.count(),
            "total_courses": Course.objects.count(),
            "total_assignments": Assignment.objects.count(),
            "total_submissions": Submission.objects.count(),
            "total_grade_entries": Grade.objects.count(),
            "total_attendance_records": Attendance.objects.count(),
            "average_grade": round(float(Grade.objects.aggregate(value=Avg("marks"))["value"] or 0), 2),
            "present_attendance": Attendance.objects.filter(status=Attendance.Status.PRESENT).count(),
            "absent_attendance": Attendance.objects.filter(status=Attendance.Status.ABSENT).count(),
            "late_attendance": Attendance.objects.filter(status=Attendance.Status.LATE).count(),
        }
        recent_activity = Notification.objects.select_related("receiver").order_by("-created_at")[:10]
        return success_response(
            "Admin analytics fetched successfully.",
            {
                "stats": stats,
                "recent_activity": AdminNotificationSerializer(recent_activity, many=True).data,
            },
        )
