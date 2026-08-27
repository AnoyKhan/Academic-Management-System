from django.db import models


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        LATE = "LATE", "Late"

    student = models.ForeignKey(
        "students.Student",
        on_delete=models.PROTECT,
        related_name="attendance_records",
    )
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.PROTECT,
        related_name="attendance_records",
    )
    date = models.DateField(db_index=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-date", "student__student_id"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course", "date"],
                name="unique_attendance_per_student_course_date",
            ),
        ]
        indexes = [
            models.Index(fields=["course", "date"]),
            models.Index(fields=["student", "status"]),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.course.course_code} - {self.date}: {self.status}"
