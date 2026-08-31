from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from rest_framework import serializers

from apps.students.models import Student


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "name",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "profile_image",
            "is_active",
            "is_staff",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if not obj.profile_image:
            return None
        if request:
            return request.build_absolute_uri(obj.profile_image.url)
        return obj.profile_image.url


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=((User.Role.STUDENT, User.Role.STUDENT),),
        required=False,
        default=User.Role.STUDENT,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "password",
            "password2",
        )
        read_only_fields = ("id",)

    def validate_email(self, value):
        email = User.objects.normalize_email(value)
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate_role(self, value):
        if value != User.Role.STUDENT:
            raise serializers.ValidationError(
                "Public registration only allows STUDENT accounts.",
            )
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password2": "Password confirmation does not match."},
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        validated_data.pop("role", None)

        user = User(
            **validated_data,
            role=User.Role.STUDENT,
            is_staff=False,
            is_superuser=False,
        )
        user.set_password(password)
        user.save()

        Student.objects.create(
            user=user,
            student_id=f"STU-{user.id:05d}",
            department="General",
            intake=str(timezone.now().year),
            batch="A",
            semester=1,
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = User.objects.normalize_email(attrs.get("email"))
        password = attrs.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError(
                {"detail": "Invalid email or password."},
            ) from exc

        user = authenticate(
            request=self.context.get("request"),
            username=user.username,
            password=password,
        )

        if not user:
            raise serializers.ValidationError({"detail": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "User account is inactive."})

        attrs["user"] = user
        return attrs
