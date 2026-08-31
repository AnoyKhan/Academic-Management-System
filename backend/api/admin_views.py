from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
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
        queryset = Student.objects.select_related("user").order_by("student_id")
        return self.paginate(queryset, AdminStudentSerializer, "Students fetched successfully.")

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
        queryset = Teacher.objects.select_related("user").order_by("employee_id")
        return self.paginate(queryset, AdminTeacherSerializer, "Teachers fetched successfully.")

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

        teacher = Teacher.objects.create(
            user=user,
            employee_id=request.data.get("employee_id") or f"EMP-{user.id:05d}",
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
        queryset = Course.objects.select_related("teacher__user").order_by("course_code")
        return self.paginate(queryset, AdminCourseSerializer, "Courses fetched successfully.")

    def post(self, request):
        teacher_id = request.data.get("teacher_id")
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=teacher_id)
        course = Course.objects.create(
            course_code=request.data.get("course_code"),
            course_name=request.data.get("course_name"),
            description=request.data.get("description", ""),
            credit=request.data.get("credit", 3),
            teacher=teacher,
        )
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
        if request.data.get("teacher_id"):
            course.teacher = get_object_or_404(Teacher.objects.all(), id=request.data["teacher_id"])
        if request.data.get("course_code") is not None:
            course.course_code = request.data["course_code"]
        if request.data.get("course_name") is not None:
            course.course_name = request.data["course_name"]
        if request.data.get("description") is not None:
            course.description = request.data["description"]
        if request.data.get("credit") is not None:
            course.credit = request.data["credit"]
        course.save()
        return success_response("Course updated successfully.", {"course": AdminCourseSerializer(course).data})

    def delete(self, request, course_id):
        course = get_object_or_404(Course.objects.all(), id=course_id)
        course.delete()
        return success_response("Course deleted successfully.")


class AdminAssignmentListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Assignment.objects.select_related("course", "created_by__user").order_by("-deadline")
        return self.paginate(queryset, AdminAssignmentSerializer, "Assignments fetched successfully.")

    def post(self, request):
        course_id = request.data.get("course_id")
        teacher_id = request.data.get("teacher_id")
        course = get_object_or_404(Course.objects.select_related("teacher"), id=course_id)
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=teacher_id or course.teacher_id)
        if course.teacher_id != teacher.id:
            return success_response("The selected teacher must match the course teacher.", status_code=status.HTTP_400_BAD_REQUEST)

        assignment = Assignment.objects.create(
            course=course,
            title=request.data.get("title"),
            description=request.data.get("description", ""),
            attachment=request.data.get("attachment"),
            deadline=request.data.get("deadline"),
            created_by=teacher,
        )
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
        if request.data.get("course_id"):
            assignment.course = get_object_or_404(Course.objects.all(), id=request.data["course_id"])
        if request.data.get("teacher_id"):
            assignment.created_by = get_object_or_404(Teacher.objects.all(), id=request.data["teacher_id"])
        if request.data.get("title") is not None:
            assignment.title = request.data["title"]
        if request.data.get("description") is not None:
            assignment.description = request.data["description"]
        if request.data.get("deadline") is not None:
            assignment.deadline = request.data["deadline"]
        if request.data.get("attachment") is not None:
            assignment.attachment = request.data["attachment"]
        assignment.save()
        return success_response("Assignment updated successfully.", {"assignment": AdminAssignmentSerializer(assignment).data})

    def delete(self, request, assignment_id):
        assignment = get_object_or_404(Assignment.objects.all(), id=assignment_id)
        assignment.delete()
        return success_response("Assignment deleted successfully.")


class AdminGradeListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Grade.objects.select_related("student__user", "assignment__course", "graded_by__user").order_by("-created_at")
        return self.paginate(queryset, AdminGradeSerializer, "Grades fetched successfully.")

    def post(self, request):
        student = get_object_or_404(Student.objects.select_related("user"), id=request.data.get("student_id"))
        assignment = get_object_or_404(Assignment.objects.select_related("course"), id=request.data.get("assignment_id"))
        teacher = get_object_or_404(Teacher.objects.select_related("user"), id=request.data.get("graded_by_id"))
        grade = Grade.objects.create(
            student=student,
            assignment=assignment,
            marks=request.data.get("marks"),
            feedback=request.data.get("feedback", ""),
            graded_by=teacher,
        )
        return success_response(
            "Grade recorded successfully.",
            {"grade": AdminGradeSerializer(grade).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminAttendanceListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Attendance.objects.select_related("student__user", "course__teacher__user").order_by("-date")
        student_id = request.query_params.get("student_id")
        course_id = request.query_params.get("course_id")
        status_value = request.query_params.get("status")
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        return self.paginate(queryset, AdminAttendanceSerializer, "Attendance fetched successfully.")

    def post(self, request):
        student = get_object_or_404(Student.objects.select_related("user"), id=request.data.get("student_id"))
        course = get_object_or_404(Course.objects.select_related("teacher"), id=request.data.get("course_id"))
        attendance = Attendance.objects.create(
            student=student,
            course=course,
            date=request.data.get("date"),
            status=request.data.get("status"),
        )
        return success_response(
            "Attendance recorded successfully.",
            {"attendance": AdminAttendanceSerializer(attendance).data},
            status_code=status.HTTP_201_CREATED,
        )


class AdminNotificationListCreateView(AdminBaseAPIView):
    def get(self, request):
        queryset = Notification.objects.select_related("receiver").order_by("-created_at")
        receiver_id = request.query_params.get("receiver_id")
        if receiver_id:
            queryset = queryset.filter(receiver_id=receiver_id)
        return self.paginate(queryset, AdminNotificationSerializer, "Notifications fetched successfully.")

    def post(self, request):
        receiver = get_object_or_404(User.objects.all(), id=request.data.get("receiver_id"))
        notification = Notification.objects.create(
            receiver=receiver,
            title=request.data.get("title"),
            message=request.data.get("message", ""),
            is_read=request.data.get("is_read", False),
        )
        return success_response(
            "Notification created successfully.",
            {"notification": AdminNotificationSerializer(notification).data},
            status_code=status.HTTP_201_CREATED,
        )


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
