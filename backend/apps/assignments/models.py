from django.db import models

from apps.shared.validators import validate_uploaded_file


class Assignment(models.Model):
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.PROTECT,
        related_name="assignments",
    )
    title = models.CharField(max_length=180, db_index=True)
    description = models.TextField(blank=True)
    attachment = models.FileField(
        upload_to="assignments/",
        blank=True,
        null=True,
        validators=[validate_uploaded_file],
    )
    deadline = models.DateTimeField(db_index=True)
    created_by = models.ForeignKey(
        "teachers.Teacher",
        on_delete=models.PROTECT,
        related_name="created_assignments",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-deadline", "-created_at"]
        indexes = [
            models.Index(fields=["course", "deadline"]),
            models.Index(fields=["created_by", "created_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.course.course_code})"


class Submission(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        SUBMITTED = "SUBMITTED", "Submitted"
        LATE = "LATE", "Late"

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.PROTECT,
        related_name="submissions",
    )
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.PROTECT,
        related_name="submissions",
    )
    submitted_file = models.FileField(
        upload_to="submissions/",
        blank=True,
        null=True,
        validators=[validate_uploaded_file],
    )
    submission_date = models.DateTimeField(blank=True, null=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    class Meta:
        ordering = ["-submission_date", "-id"]
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "student"],
                name="unique_submission_per_assignment_student",
            ),
        ]
        indexes = [
            models.Index(fields=["assignment", "status"]),
            models.Index(fields=["student", "status"]),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.assignment.title}"
