from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from apps.shared.responses import success_response

from .serializers import (
    LoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return success_response(
            "Registration successful",
            {"user": UserSerializer(user, context={"request": request}).data},
            status_code=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return success_response(
            "Login successful",
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                },
            },
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return success_response(
            "Profile retrieved successfully",
            {
                "user": UserSerializer(
                    user,
                    context={"request": request},
                ).data,
            },
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            raise ValidationError({"refresh": "Refresh token is required."})

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            raise ValidationError({"refresh": "Invalid or expired refresh token."})

        return success_response("Logout successful")
