from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="student_profile",
    )
    student_id = models.CharField(max_length=30, unique=True, db_index=True)
    department = models.CharField(max_length=120, db_index=True)
    intake = models.CharField(max_length=50, db_index=True)
    batch = models.CharField(max_length=50, db_index=True)
    semester = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],
        db_index=True,
    )
    date_of_birth = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["student_id"]
        indexes = [
            models.Index(fields=["department", "batch"]),
            models.Index(fields=["intake", "semester"]),
        ]

    def clean(self):
        if self.user_id and self.user.role != "STUDENT":
            raise ValidationError({"user": "Selected user must have STUDENT role."})

    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name() or self.user.username}"
