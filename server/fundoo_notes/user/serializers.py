from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinLengthValidator
from django.contrib.auth import authenticate
from django.utils.timezone import now

from .utils.utils import get_tokens_for_user
from .models import User
from loguru import logger


class RegisterSerializer(serializers.ModelSerializer):
    """
    desc: Serializer for user registration. Handles password validation and creates a new user.
    params:
        - password (CharField): User's password, validated and write-only.
        - username (CharField): User's username, required and must be at least 3 characters long.
    return: 
        - User (User): The created user instance with the validated data.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )

    username = serializers.CharField(
        required=True,
        validators=[MinLengthValidator(3)]
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'is_verified']
        read_only_fields = ['is_verified']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    desc: Serializer for user login. Authenticates the user and returns tokens upon successful login.
    params:
        - email (EmailField): User's email address, used for authentication.
        - password (CharField): User's password, validated and write-only.
    return: 
        - dict: A dictionary containing user data and JWT tokens if authentication is successful.
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        logger.info(email)
        logger.info(password)
        user = authenticate(email=email, password=password)
        logger.info(user)
        if user is None:
            raise serializers.ValidationError({
                'message': 'Invalid email or password',
                'status': 'error'
            })
        if not user.is_verified: # type: ignore
            raise serializers.ValidationError("user is not verified")

        # Update last login time
        user.last_login = now()
        user.save()
        logger.info(user)

        # Generate tokens for the user
        tokens = get_tokens_for_user(user)

        # Return user data along with tokens
        return {
            'data': {
                'id': user.id,  # type: ignore
                'username': user.username,
                'email': user.email,
            },
            'tokens': tokens
        }
