from django.db.models import Avg, F, Q
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.permissions import IsStudent, IsTeacher
from apps.assignments.models import Assignment, Submission
from apps.attendance.models import Attendance
from apps.courses.models import Course
from apps.grades.models import Grade
from apps.shared.responses import success_response
from apps.students.models import Student
from apps.teachers.models import Teacher


class StudentAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        student = get_object_or_404(Student.objects.select_related("user"), user=request.user)
        courses = Course.objects.filter(
            Q(attendance_records__student=student)
            | Q(assignments__submissions__student=student)
            | Q(assignments__grades__student=student)
        ).distinct()
        assignments = Assignment.objects.filter(course__in=courses)
        submitted_assignment_ids = Submission.objects.filter(student=student).values_list("assignment_id", flat=True)
        pending_assignments = assignments.exclude(id__in=submitted_assignment_ids).count()
        grade_queryset = Grade.objects.filter(student=student)
        average_marks = grade_queryset.aggregate(value=Avg("marks"))["value"]
        attendance_records = Attendance.objects.filter(student=student)
        total_attendance = attendance_records.count()
        present_count = attendance_records.filter(status=Attendance.Status.PRESENT).count()
        attendance_percentage = round((present_count / total_attendance) * 100, 2) if total_attendance else 0
        recent_grades = grade_queryset.select_related("assignment__course").order_by("-created_at")[:5]

        course_completion = []
        for course in courses.select_related("teacher__user").order_by("course_name"):
            course_assignments = assignments.filter(course=course)
            completed_count = Submission.objects.filter(student=student, assignment__course=course).count()
            course_completion.append(
                {
                    "course": course.course_name,
                    "total_assignments": course_assignments.count(),
                    "completed_assignments": completed_count,
                    "progress": round((completed_count / course_assignments.count()) * 100, 2) if course_assignments.count() else 0,
                }
            )

        return success_response(
            "Student analytics fetched successfully.",
            {
                "total_courses": courses.count(),
                "total_assignments": assignments.count(),
                "pending_assignments": pending_assignments,
                "average_marks": round(float(average_marks), 2) if average_marks is not None else 0,
                "attendance_percentage": attendance_percentage,
                "total_attendance_records": total_attendance,
                "present_attendance": present_count,
                "recent_grades": [
                    {
                        "course": grade.assignment.course.course_name,
                        "assignment": grade.assignment.title,
                        "marks": str(grade.marks),
                        "feedback": grade.feedback,
                    }
                    for grade in recent_grades
                ],
                "course_completion": course_completion,
            },
        )


class TeacherAnalyticsView(APIView):
    permission_classes = [IsAuthenticated, IsTeacher]

    def get(self, request):
        teacher = get_object_or_404(Teacher.objects.select_related("user"), user=request.user)
        courses = Course.objects.filter(teacher=teacher)
        teacher_assignments = Assignment.objects.filter(course__teacher=teacher)
        grade_queryset = Grade.objects.filter(assignment__course__teacher=teacher)
        total_students = Student.objects.filter(
            Q(attendance_records__course__teacher=teacher)
            | Q(submissions__assignment__course__teacher=teacher)
            | Q(grades__assignment__course__teacher=teacher)
        ).distinct().count()
        pending_submissions = (
            Submission.objects.filter(assignment__course__teacher=teacher)
            .exclude(student__grades__assignment_id=F("assignment_id"))
            .count()
        )
        attendance_records = Attendance.objects.filter(course__teacher=teacher)
        total_attendance = attendance_records.count()
        present_count = attendance_records.filter(status=Attendance.Status.PRESENT).count()
        attendance_percentage = round((present_count / total_attendance) * 100, 2) if total_attendance else 0
        recent_submissions = (
            Submission.objects.filter(assignment__course__teacher=teacher)
            .select_related("assignment__course", "student__user")
            .order_by("-submission_date", "-id")[:5]
        )

        return success_response(
            "Teacher analytics fetched successfully.",
            {
                "total_courses": courses.count(),
                "total_students": total_students,
                "total_assignments": teacher_assignments.count(),
                "pending_submissions": pending_submissions,
                "total_grade_entries": grade_queryset.count(),
                "average_marks": round(float(grade_queryset.aggregate(value=Avg("marks"))["value"] or 0), 2),
                "attendance_percentage": attendance_percentage,
                "total_attendance_records": total_attendance,
                "present_attendance": present_count,
                "recent_submissions": [
                    {
                        "id": submission.id,
                        "student": submission.student.user.get_full_name() or submission.student.user.username,
                        "student_id": submission.student.student_id,
                        "assignment": submission.assignment.title,
                        "course": submission.assignment.course.course_name,
                        "status": submission.status,
                        "submission_date": submission.submission_date.isoformat() if submission.submission_date else None,
                    }
                    for submission in recent_submissions
                ],
            },
        )


class AnalyticsOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "STUDENT":
            student = get_object_or_404(Student.objects.select_related("user"), user=user)
            courses = Course.objects.filter(
                Q(attendance_records__student=student)
                | Q(assignments__submissions__student=student)
                | Q(assignments__grades__student=student)
            ).distinct()
            assignments = Assignment.objects.filter(course__in=courses)
            submitted_ids = Submission.objects.filter(student=student).values_list("assignment_id", flat=True)
            pending_assignments = assignments.exclude(id__in=submitted_ids).count()
            avg_marks = Grade.objects.filter(student=student).aggregate(value=Avg("marks"))["value"]
            attendance_records = Attendance.objects.filter(student=student)
            total_attendance = attendance_records.count()
            present_count = attendance_records.filter(status=Attendance.Status.PRESENT).count()
            attendance_percentage = round((present_count / total_attendance) * 100, 2) if total_attendance else 0
            recent_grades = Grade.objects.filter(student=student).select_related("assignment__course").order_by("-created_at")[:5]
            return success_response(
                "Student analytics fetched successfully.",
                {
                    "total_courses": courses.count(),
                    "pending_assignments": pending_assignments,
                    "average_marks": round(float(avg_marks), 2) if avg_marks is not None else 0,
                    "attendance_percentage": attendance_percentage,
                    "recent_grades": [
                        {
                            "course": grade.assignment.course.course_name,
                            "assignment": grade.assignment.title,
                            "marks": str(grade.marks),
                            "feedback": grade.feedback,
                        }
                        for grade in recent_grades
                    ],
                },
            )

        if user.role == "TEACHER":
            teacher = get_object_or_404(Teacher.objects.select_related("user"), user=user)
            courses = Course.objects.filter(teacher=teacher)
            total_students = Student.objects.filter(
                Q(attendance_records__course__teacher=teacher)
                | Q(submissions__assignment__course__teacher=teacher)
                | Q(grades__assignment__course__teacher=teacher)
            ).distinct().count()
            pending_submissions = (
                Submission.objects.filter(assignment__course__teacher=teacher)
                .exclude(student__grades__assignment_id=F("assignment_id"))
                .count()
            )
            return success_response(
                "Teacher analytics fetched successfully.",
                {
                    "total_courses": courses.count(),
                    "total_students": total_students,
                    "total_assignments": Assignment.objects.filter(course__teacher=teacher).count(),
                    "pending_submissions": pending_submissions,
                },
            )

        stats = {
            "total_users": user.__class__.objects.count(),
            "total_students": Student.objects.count(),
            "total_teachers": Teacher.objects.count(),
            "total_courses": Course.objects.count(),
            "total_assignments": Assignment.objects.count(),
            "total_submissions": Submission.objects.count(),
            "total_grade_entries": Grade.objects.count(),
            "average_grade": round(float(Grade.objects.aggregate(value=Avg("marks"))["value"] or 0), 2),
            "attendance_percentage": round((Attendance.objects.filter(status=Attendance.Status.PRESENT).count() / Attendance.objects.count()) * 100, 2) if Attendance.objects.count() else 0,
        }
        return success_response("Admin analytics fetched successfully.", {"stats": stats})
