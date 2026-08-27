from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Teacher(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="teacher_profile",
    )
    employee_id = models.CharField(max_length=30, unique=True, db_index=True)
    department = models.CharField(max_length=120, db_index=True)
    designation = models.CharField(max_length=120, db_index=True)
    joining_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["employee_id"]
        indexes = [
            models.Index(fields=["department", "designation"]),
        ]

    def clean(self):
        if self.user_id and self.user.role != "TEACHER":
            raise ValidationError({"user": "Selected user must have TEACHER role."})

    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name() or self.user.username}"
