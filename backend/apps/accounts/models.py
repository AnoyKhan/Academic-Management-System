from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models

from apps.shared.validators import validate_profile_image


class UserManager(DjangoUserManager):
    """User manager that normalizes email for all user creation paths."""

    def _create_user(self, username, email, password, **extra_fields):
        email = self.normalize_email(email)
        return super()._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        TEACHER = "TEACHER", "Teacher"
        ADMIN = "ADMIN", "Admin"

    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT,
        db_index=True,
    )
    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
        validators=[validate_profile_image],
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["role", "is_active"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        full_name = self.get_full_name()
        return full_name or self.username
