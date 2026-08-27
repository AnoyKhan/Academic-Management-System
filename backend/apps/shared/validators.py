from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator


MAX_UPLOAD_SIZE = 10 * 1024 * 1024
ALLOWED_UPLOAD_EXTENSIONS = ("pdf", "doc", "docx", "ppt", "pptx", "zip", "jpg", "jpeg", "png")
ALLOWED_IMAGE_EXTENSIONS = ("jpg", "jpeg", "png")


def _validate_upload_size(file_obj):
    if file_obj.size > MAX_UPLOAD_SIZE:
        raise ValidationError("File size must be 10 MB or less.")


def validate_uploaded_file(file_obj):
    FileExtensionValidator(allowed_extensions=ALLOWED_UPLOAD_EXTENSIONS)(file_obj)
    _validate_upload_size(file_obj)


def validate_profile_image(file_obj):
    FileExtensionValidator(allowed_extensions=ALLOWED_IMAGE_EXTENSIONS)(file_obj)
    _validate_upload_size(file_obj)
