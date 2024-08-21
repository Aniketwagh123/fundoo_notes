from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import MinLengthValidator
from django.contrib.auth import authenticate
from django.utils.timezone import now


User = get_user_model()


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email',
#                   'first_name', 'last_name', 'is_verified']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        validators=[validate_password])

    username = serializers.CharField(
        required=True,
        validators=[MinLengthValidator(3)]
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'is_verified']

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
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True, style={
                                     'input_type': 'password'})


    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')

        user = authenticate(email=email, password=password)
        if user is None:
            raise serializers.ValidationError({'message': 'Invalid email or password', 'status': 'error'})
        
       
        # Update last login time
        user.last_login = now()
        user.save()
        return user
