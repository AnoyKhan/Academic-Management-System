from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.assignments.models import Assignment
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.students.models import Student
from apps.teachers.models import Teacher


class AuthFlowTests(TestCase):
    def test_student_registration_creates_student_profile(self):
        payload = {
            "username": "student1",
            "email": "student1@example.com",
            "first_name": "Student",
            "last_name": "One",
            "phone": "1234567890",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
        }

        response = APIClient().post("/api/auth/register/", payload, format="json")

        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get(email="student1@example.com")
        self.assertTrue(Student.objects.filter(user=user).exists())

    def test_login_returns_access_token_for_student(self):
        user = User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        Student.objects.create(
            user=user,
            student_id="STU-1002",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=1,
        )

        response = APIClient().post(
            "/api/auth/login/",
            {"email": "student2@example.com", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertIn("access", response.data["data"])
        self.assertEqual(response.data["data"]["user"]["role"], "STUDENT")

    def test_student_can_fetch_notifications(self):
        user = User.objects.create_user(
            username="student_notifications",
            email="student_notifications@example.com",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        Student.objects.create(
            user=user,
            student_id="STU-2001",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=2,
        )
        Notification.objects.create(
            receiver=user,
            title="Welcome",
            message="Your profile is ready.",
        )

        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get("/api/student/notifications/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["results"][0]["title"], "Welcome")


class RoleAnalyticsAPITests(TestCase):
    def setUp(self):
        self.student_user = User.objects.create_user(
            username="student_analytics_user",
            email="student_analytics@example.com",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        self.student_profile = Student.objects.create(
            user=self.student_user,
            student_id="STU-AN-1001",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=4,
        )

        self.teacher_user = User.objects.create_user(
            username="teacher_analytics_user",
            email="teacher_analytics@example.com",
            password="StrongPass123!",
            role=User.Role.TEACHER,
        )
        self.teacher_profile = Teacher.objects.create(
            user=self.teacher_user,
            employee_id="EMP-AN-1001",
            department="Computer Science",
            designation="Lecturer",
        )

        self.admin_user = User.objects.create_user(
            username="admin_analytics_user",
            email="admin_analytics@example.com",
            password="StrongPass123!",
            role=User.Role.ADMIN,
        )

        self.course = Course.objects.create(
            course_code="CS-401",
            course_name="Advanced Algorithms",
            credit="3.00",
            teacher=self.teacher_profile,
        )
        self.assignment = Assignment.objects.create(
            course=self.course,
            title="Week 1 Quiz",
            description="Quiz on algorithms",
            deadline="2026-12-01T12:00:00Z",
            created_by=self.teacher_profile,
        )

        Attendance.objects.create(
            student=self.student_profile,
            course=self.course,
            date="2026-08-01",
            status=Attendance.Status.PRESENT,
        )
        Grade.objects.create(
            student=self.student_profile,
            assignment=self.assignment,
            marks=85,
            feedback="Great work",
            graded_by=self.teacher_profile,
        )

    def test_student_can_fetch_own_analytics(self):
        client = APIClient()
        login = client.post(
            "/api/auth/login/",
            {"email": "student_analytics@example.com", "password": "StrongPass123!"},
            format="json",
        )
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['data']['access']}")

        response = client.get("/api/analytics/student/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["total_courses"], 1)
        self.assertGreaterEqual(response.data["data"]["average_marks"], 0)

    def test_teacher_can_fetch_own_analytics(self):
        client = APIClient()
        login = client.post(
            "/api/auth/login/",
            {"email": "teacher_analytics@example.com", "password": "StrongPass123!"},
            format="json",
        )
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['data']['access']}")

        response = client.get("/api/analytics/teacher/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["total_courses"], 1)
        self.assertEqual(response.data["data"]["total_students"], 1)

    def test_student_cannot_access_teacher_analytics(self):
        client = APIClient()
        login = client.post(
            "/api/auth/login/",
            {"email": "student_analytics@example.com", "password": "StrongPass123!"},
            format="json",
        )
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['data']['access']}")

        response = client.get("/api/analytics/teacher/")

        self.assertEqual(response.status_code, 403)

    def test_teacher_cannot_access_student_analytics(self):
        client = APIClient()
        login = client.post(
            "/api/auth/login/",
            {"email": "teacher_analytics@example.com", "password": "StrongPass123!"},
            format="json",
        )
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['data']['access']}")

        response = client.get("/api/analytics/student/")

        self.assertEqual(response.status_code, 403)


class AdminAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin1",
            email="admin1@example.com",
            password="StrongPass123!",
            role=User.Role.ADMIN,
        )
        self.student_user = User.objects.create_user(
            username="student_admin",
            email="student_admin@example.com",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        self.student_profile = Student.objects.create(
            user=self.student_user,
            student_id="STU-9001",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=2,
        )

    def test_admin_dashboard_returns_summary_counts(self):
        login_response = self.client.post(
            "/api/auth/login/",
            {"email": "admin1@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['data']['access']}"
        )

        response = self.client.get("/api/admin/dashboard/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["stats"]["students"], 1)
        self.assertEqual(response.data["data"]["stats"]["teachers"], 0)

    def test_admin_students_list_returns_student_profiles(self):
        login_response = self.client.post(
            "/api/auth/login/",
            {"email": "admin1@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['data']['access']}"
        )

        response = self.client.get("/api/admin/students/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["results"][0]["student_id"], "STU-9001")
