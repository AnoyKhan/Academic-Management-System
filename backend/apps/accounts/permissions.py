from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    message = "Only student users can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "STUDENT"
        )


class IsTeacher(BasePermission):
    message = "Only teacher users can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "TEACHER"
        )


class IsAdmin(BasePermission):
    message = "Only admin users can access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )
