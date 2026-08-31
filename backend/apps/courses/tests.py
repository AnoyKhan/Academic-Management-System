from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.assignments.models import Assignment, Submission
from apps.courses.models import Course
from apps.students.models import Student
from apps.teachers.models import Teacher


class CourseAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher_user = User.objects.create_user(
            username="teacher1",
            email="teacher1@example.com",
            password="StrongPass123!",
            role=User.Role.TEACHER,
        )
        self.teacher = Teacher.objects.create(
            user=self.teacher_user,
            employee_id="EMP-1001",
            department="Computer Science",
            designation="Lecturer",
        )
        self.course = Course.objects.create(
            course_code="CS101",
            course_name="Intro to Computing",
            description="Introductory computing course.",
            credit=3,
            teacher=self.teacher,
        )

        self.student_user = User.objects.create_user(
            username="student1",
            email="student1@example.com",
            password="StrongPass123!",
            role=User.Role.STUDENT,
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id="STU-1001",
            department="Computer Science",
            intake="2024",
            batch="A",
            semester=1,
        )

    def test_student_can_fetch_courses_related_to_them(self):
        self.student_user.student_profile
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get("/api/course/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])

    def test_teacher_can_fetch_their_courses(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get("/api/course/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["results"][0]["course_code"], "CS101")

    def test_teacher_can_create_assignment_for_own_course(self):
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.post(
            "/api/assignment/",
            {
                "title": "Lab 1",
                "description": "Create a simple HTML page.",
                "deadline": (timezone.now() + timezone.timedelta(days=3)).isoformat(),
                "course_id": self.course.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["assignment"]["course"]["id"], self.course.id)
        self.assertEqual(response.data["data"]["assignment"]["created_by"]["id"], self.teacher.id)

    def test_teacher_analytics_counts_ungraded_submissions(self):
        self.client.force_authenticate(user=self.teacher_user)
        assignment = Assignment.objects.create(
            course=self.course,
            title="Quiz 1",
            description="Reading quiz",
            deadline=timezone.now() + timezone.timedelta(days=1),
            created_by=self.teacher,
        )
        Submission.objects.create(
            assignment=assignment,
            student=self.student,
            status=Submission.Status.SUBMITTED,
            submission_date=timezone.now(),
        )

        response = self.client.get("/api/analytics/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["pending_submissions"], 1)
