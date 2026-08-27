from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
    TokenVerifySerializer,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView as SimpleJWTTokenObtainPairView,
    TokenRefreshView as SimpleJWTTokenRefreshView,
    TokenVerifyView as SimpleJWTTokenVerifyView,
)

from apps.shared.responses import success_response


class HealthCheckAPIView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        return success_response(
            "Backend running successfully",
            {"status": "Backend running successfully"},
        )


class TokenObtainPairAPIView(SimpleJWTTokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return success_response(
            "Token issued successfully",
            response.data,
            response.status_code,
        )


class TokenRefreshAPIView(SimpleJWTTokenRefreshView):
    serializer_class = TokenRefreshSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return success_response(
            "Token refreshed successfully",
            response.data,
            response.status_code,
        )


class TokenVerifyAPIView(SimpleJWTTokenVerifyView):
    serializer_class = TokenVerifySerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return success_response(
            "Token verified successfully",
            {},
            response.status_code,
        )
