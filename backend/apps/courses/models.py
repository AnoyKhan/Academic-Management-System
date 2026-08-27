from decimal import Decimal

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Course(models.Model):
    course_code = models.CharField(max_length=30, unique=True, db_index=True)
    course_name = models.CharField(max_length=180, db_index=True)
    description = models.TextField(blank=True)
    credit = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.50")), MaxValueValidator(10)],
    )
    teacher = models.ForeignKey(
        "teachers.Teacher",
        on_delete=models.PROTECT,
        related_name="courses",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["course_code"]
        indexes = [
            models.Index(fields=["course_code", "course_name"]),
            models.Index(fields=["teacher", "created_at"]),
        ]

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"
