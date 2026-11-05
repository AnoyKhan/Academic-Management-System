from datetime import date, timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.assignments.models import Assignment
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.notifications.models import Notification
from apps.students.models import Student
from apps.teachers.models import Teacher


class AdminAcademicCrudTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="crud_admin", email="crud.admin@example.com", password="StrongPass123!", role=User.Role.ADMIN
        )
        self.teacher_user = User.objects.create_user(
            username="crud_teacher", email="crud.teacher@example.com", password="StrongPass123!", role=User.Role.TEACHER
        )
        self.teacher = Teacher.objects.create(
            user=self.teacher_user, employee_id="EMP-CRUD-1", department="Computer Science", designation="Lecturer"
        )
        self.student_user = User.objects.create_user(
            username="crud_student", email="crud.student@example.com", password="StrongPass123!", role=User.Role.STUDENT
        )
        self.student = Student.objects.create(
            user=self.student_user, student_id="STU-CRUD-1", department="Computer Science", intake="2024", batch="A", semester=4
        )
        self.course = Course.objects.create(
            course_code="CRUD-101", course_name="CRUD Testing", credit=3, teacher=self.teacher
        )
        self.assignment = Assignment.objects.create(
            course=self.course, title="CRUD assignment", description="Test", deadline=timezone.now() + timedelta(days=7), created_by=self.teacher
        )
        self.grade = Grade.objects.create(
            student=self.student, assignment=self.assignment, marks=70, feedback="Original", graded_by=self.teacher
        )
        self.attendance = Attendance.objects.create(
            student=self.student, course=self.course, date=date(2026, 9, 1), status=Attendance.Status.PRESENT
        )

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.admin)

    def test_admin_can_update_and_delete_grade_without_related_deletion(self):
        self.authenticate_admin()
        response = self.client.patch(
            f"/api/admin/grades/{self.grade.id}/", {"marks": 88, "feedback": "Corrected"}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.grade.refresh_from_db()
        self.assertEqual(str(self.grade.marks), "88.00")

        response = self.client.delete(f"/api/admin/grades/{self.grade.id}/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertFalse(Grade.objects.filter(id=self.grade.id).exists())
        self.assertTrue(Assignment.objects.filter(id=self.assignment.id).exists())
        self.assertTrue(Student.objects.filter(id=self.student.id).exists())

    def test_admin_rejects_invalid_grade_and_duplicate_grade(self):
        self.authenticate_admin()
        response = self.client.patch(f"/api/admin/grades/{self.grade.id}/", {"marks": 101}, format="json")
        self.assertEqual(response.status_code, 400, response.data)

        response = self.client.post(
            "/api/admin/grades/",
            {"student_id": self.student.id, "assignment_id": self.assignment.id, "marks": 80, "graded_by_id": self.teacher.id},
            format="json",
        )
        self.assertEqual(response.status_code, 400, response.data)

    def test_admin_can_update_and_delete_attendance(self):
        self.authenticate_admin()
        response = self.client.patch(
            f"/api/admin/attendance/{self.attendance.id}/", {"status": Attendance.Status.ABSENT}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.attendance.refresh_from_db()
        self.assertEqual(self.attendance.status, Attendance.Status.ABSENT)

        response = self.client.delete(f"/api/admin/attendance/{self.attendance.id}/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertFalse(Attendance.objects.filter(id=self.attendance.id).exists())
        self.assertTrue(Course.objects.filter(id=self.course.id).exists())
        self.assertTrue(Student.objects.filter(id=self.student.id).exists())

    def test_admin_rejects_invalid_attendance_and_non_admin_is_denied(self):
        self.authenticate_admin()
        response = self.client.patch(
            f"/api/admin/attendance/{self.attendance.id}/", {"status": "UNKNOWN"}, format="json"
        )
        self.assertEqual(response.status_code, 400, response.data)

        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.delete(f"/api/admin/attendance/{self.attendance.id}/")
        self.assertEqual(response.status_code, 403, response.data)
        self.assertTrue(Attendance.objects.filter(id=self.attendance.id).exists())

    def test_admin_notification_update_delete_is_isolated_and_non_admin_denied(self):
        notification = Notification.objects.create(
            receiver=self.student_user, title="Original", message="Original message"
        )
        self.authenticate_admin()
        response = self.client.patch(
            f"/api/admin/notifications/{notification.id}/", {"title": "Updated"}, format="json"
        )
        self.assertEqual(response.status_code, 200, response.data)
        notification.refresh_from_db()
        self.assertEqual(notification.title, "Updated")

        response = self.client.delete(f"/api/admin/notifications/{notification.id}/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertFalse(Notification.objects.filter(id=notification.id).exists())
        self.assertTrue(User.objects.filter(id=self.student_user.id).exists())

        notification = Notification.objects.create(receiver=self.student_user, title="Protected", message="Keep")
        self.client.force_authenticate(user=self.student_user)
        response = self.client.delete(f"/api/admin/notifications/{notification.id}/")
        self.assertEqual(response.status_code, 403, response.data)
        self.assertTrue(Notification.objects.filter(id=notification.id).exists())


class AdminListQueryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="query_admin",
            email="query.admin@example.com",
            password="StrongPass123!",
            role=User.Role.ADMIN,
        )
        self.teacher_user = User.objects.create_user(
            username="query_teacher",
            email="query.teacher@example.com",
            first_name="Query",
            last_name="Teacher",
            password="StrongPass123!",
            role=User.Role.TEACHER,
        )
        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            employee_id="EMP-QUERY-1",
            department="Computer Science",
            designation="Lecturer",
        )
        self.student_user = User.objects.create_user(
            username="query_student",
            email="query.student@example.com",
            first_name="Query",
            last_name="Student",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id="STU-QUERY-1",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=4,
        )
        self.course = Course.objects.create(
            course_code="QUERY-101",
            course_name="Query Course",
            credit=3,
            teacher=self.teacher,
        )
        self.assignment = Assignment.objects.create(
            course=self.course,
            title="Query Assignment",
            description="Searchable assignment",
            deadline=timezone.now() + timedelta(days=7),
            created_by=self.teacher,
        )
        self.grade = Grade.objects.create(
            student=self.student,
            assignment=self.assignment,
            marks=88,
            graded_by=self.teacher,
        )
        self.attendance = Attendance.objects.create(
            student=self.student,
            course=self.course,
            date=date(2026, 9, 1),
            status=Attendance.Status.PRESENT,
        )
        self.client.force_authenticate(user=self.admin)

    def test_admin_lists_support_pagination_and_combined_queries(self):
        cases = [
            ("/api/admin/students/", {"search": "Query", "department": "Computer Science"}),
            ("/api/admin/teachers/", {"search": "Query", "designation": "Lecturer"}),
            ("/api/admin/courses/", {"search": "QUERY-101", "teacher_id": self.teacher.id}),
            ("/api/admin/assignments/", {"search": "Searchable", "course_id": self.course.id}),
            ("/api/admin/grades/", {"search": "Query", "student_id": self.student.id}),
            ("/api/admin/attendance/", {"search": "QUERY-101", "status": "PRESENT"}),
        ]
        for endpoint, params in cases:
            response = self.client.get(
                endpoint,
                {**params, "page": 1, "page_size": 1},
            )
            self.assertEqual(response.status_code, 200, response.data)
            self.assertEqual(response.data["data"]["count"], 1)
            self.assertEqual(len(response.data["data"]["results"]), 1)

    def test_admin_page_size_is_capped_and_empty_search_is_valid(self):
        response = self.client.get("/api/admin/students/", {"page_size": 1000})
        self.assertEqual(response.status_code, 200, response.data)
        self.assertLessEqual(len(response.data["data"]["results"]), 100)

        second_assignment = Assignment.objects.create(
            course=self.course,
            title="Second Query Assignment",
            deadline=timezone.now() + timedelta(days=14),
            created_by=self.teacher,
        )
        Grade.objects.create(
            student=self.student,
            assignment=second_assignment,
            marks=75,
            graded_by=self.teacher,
        )
        response = self.client.get("/api/admin/grades/", {"page": 2, "page_size": 1})
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["data"]["count"], 2)
        self.assertEqual(len(response.data["data"]["results"]), 1)

        response = self.client.get("/api/admin/attendance/", {"search": "does-not-exist"})
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["data"]["count"], 0)
        self.assertEqual(response.data["data"]["results"], [])

    def test_non_admin_and_unauthenticated_users_are_denied(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get("/api/admin/students/")
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(user=None)
        response = self.client.get("/api/admin/students/")
        self.assertEqual(response.status_code, 401)
