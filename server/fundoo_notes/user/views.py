from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from django.db.transaction import atomic
from datetime import datetime, timedelta, timezone

from .task import send_verification_email_task

from .utils.utils import send_verification_email
from .serializers import RegisterSerializer, LoginSerializer
from .models import User
from .utils.JWTUtil import JWTUtil
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers



class RegisterUserView(APIView):
    """
    desc: Handles user registration by saving user data, sending a verification email, 
          and returning the appropriate response.
    params: 
        - request (Request): The HTTP request object containing the user data.
        - *args, **kwargs: Additional arguments and keyword arguments.
    return: 
        - Response: HTTP response with a success or error message and the user data.
    """
    authentication_classes = []  # No authentication required
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="user login", request_body=RegisterSerializer, responses={200: RegisterSerializer})
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        try:
            with atomic():
                if serializer.is_valid():
                    user = serializer.save()
                    user_data = serializer.data

                    # Email verification logic
                    token_payload = {
                        "user_id": user.id,  # type: ignore
                        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=1),
                        "aud": "register"
                    }
                    encoded_token = JWTUtil.encode_token(token_payload)

                    verification_link = request.build_absolute_uri(
                        reverse('verify_email', args=[encoded_token])
                    )
                    send_verification_email_task.delay(
                        user.email, verification_link)  # type: ignore

                    return Response({
                        'message': 'User registered successfully',
                        'status': 'success',
                        'data': user_data
                    }, status=status.HTTP_201_CREATED)

                return Response({
                    'message': 'Invalid data',
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'message': 'An unexpected error occurred during registration',
                'status': 'error',
                'errors': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from .serializers import LoginSerializer

class LoginUserView(APIView):
    """
    Handles user login by validating credentials and returning 
    a response with a JWT token if successful.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="User login", request_body=LoginSerializer, responses={200: LoginSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                     401: "Unauthorized: Invalid credentials.",
                                                                                                     403: "Forbidden: Unverified user.",
                                                                                                     500: "Internal Server Error: Token generation error."})
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        try:
            if serializer.is_valid():
                response_data = serializer.save()
                response = {
                    'message': 'User login successful',
                    'status': 'success',
                    'data': response_data['data'],  # Include user data # type: ignore
                    'tokens': response_data['tokens']  # Include tokens # type: ignore
                }
                return Response(response, status=status.HTTP_200_OK)

            return Response({
                'message': 'Invalid data',
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except serializers.ValidationError as e:
            if 'user is not verified' in str(e.detail):  # Check error message in list
                return Response({
                    'message': 'User is not verified',
                    'status': 'error'
                }, status=status.HTTP_403_FORBIDDEN)
            return Response({
                'message': 'Invalid credentials or other error',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def verify_registered_user(request, token: str):
    """
    desc: Verifies user registration by decoding the JWT token and 
          updating the user's verification status.
    params: 
        - request (Request): The HTTP request object containing the token.
        - token (str): The JWT token used for user verification.
    return: 
        - Response: HTTP response with a success or error message based on verification.
    """

    try:
        decoded_access_token = JWTUtil.decode_token(token)
        user_id = decoded_access_token.get("user_id")
        user = User.objects.get(id=user_id)

        if user.is_verified:
            return Response({
                'message': 'User is already verified',
                'status': 'success'
            }, status=status.HTTP_200_OK)

        user.is_verified = True
        user.save()

        return Response({
            'message': 'User verified successfully',
            'status': 'success'
        }, status=status.HTTP_200_OK)

    except ExpiredSignatureError:
        return Response({
            'message': 'Verification link has expired',
            'status': 'error',
        }, status=status.HTTP_400_BAD_REQUEST)

    except InvalidTokenError:
        return Response({
            'message': 'Invalid verification link',
            'status': 'error',
        }, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({
            'message': 'User not found',
            'status': 'error',
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({
            'message': 'An unexpected error occurred during verification',
            'status': 'error',
            'errors': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
