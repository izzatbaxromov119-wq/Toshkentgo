from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """Ro'yxatdan o'tish: username, email, parol."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "password")

    def validate_password(self, value):
        validate_password(value)  # Django'ning tayyor parol tekshiruvi
        return value

    def create(self, validated_data):
        # create_user parolni xavfsiz (hash) holda saqlaydi
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    """Profil ma'lumotlari (parolsiz)."""

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name")
