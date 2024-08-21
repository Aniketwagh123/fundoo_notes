from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer
from .models import User


class RegisterUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = RegisterSerializer(user).data
            return Response({'message': 'User registered successfully', 'status': 'success', 'data': user_data}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Invalid data', 'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User login successful', 'status': 'success'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid data', 'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
