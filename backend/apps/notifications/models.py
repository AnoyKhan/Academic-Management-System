from django.conf import settings
from django.db import models


class Notification(models.Model):
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=180, db_index=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["receiver", "is_read"]),
            models.Index(fields=["receiver", "created_at"]),
        ]

    def __str__(self):
        return f"{self.title} -> {self.receiver}"
