from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Grade(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.PROTECT,
        related_name="grades",
    )
    assignment = models.ForeignKey(
        "assignments.Assignment",
        on_delete=models.PROTECT,
        related_name="grades",
    )
    marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    feedback = models.TextField(blank=True)
    graded_by = models.ForeignKey(
        "teachers.Teacher",
        on_delete=models.PROTECT,
        related_name="graded_assignments",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "assignment"],
                name="unique_grade_per_student_assignment",
            ),
        ]
        indexes = [
            models.Index(fields=["student", "created_at"]),
            models.Index(fields=["assignment", "graded_by"]),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.assignment.title}: {self.marks}"
