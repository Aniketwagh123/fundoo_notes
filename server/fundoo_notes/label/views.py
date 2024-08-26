from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import DatabaseError
from loguru import logger

from .models import Label
from .serializers import LabelSerializer


class LabelViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """
    A viewset for viewing, creating, updating, and deleting labels.

    desc: Handles CRUD operations for user labels with JWT authentication and logging.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

    def get_queryset(self):
        """
        desc: Limits queryset to the authenticated user's labels.
        return: QuerySet: Filtered queryset of labels.
        """
        return self.queryset.filter(user=self.request.user)

    def handle_exception(self, exc):
        """
        desc: Custom exception handler to log errors and return a formatted response.
        params: exc (Exception): The caught exception.
        return: Response: The formatted error response.
        """
        if isinstance(exc, ObjectDoesNotExist):
            logger.warning(f"Label not found: {exc}")
            return Response({
                'message': 'Label not found',
                'status': 'error',
                'errors': str(exc)
            }, status=status.HTTP_404_NOT_FOUND)

        elif isinstance(exc, ValidationError):
            logger.error(f"Validation error: {exc}")
            return Response({
                'message': 'Validation error',
                'status': 'error',
                'errors': exc.detail  # type: ignore
            }, status=status.HTTP_400_BAD_REQUEST)

        elif isinstance(exc, DatabaseError):
            logger.error(f"Database error: {exc}")
            return Response({
                'message': 'Database error',
                'status': 'error',
                'errors': str(exc)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            logger.error(f"Unexpected error: {exc}")
            return Response({
                'message': 'An unexpected error occurred',
                'status': 'error',
                'errors': str(exc)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        """
        desc: Creates a new label for the authenticated user.
        params: request (Request): The HTTP request object with label data.
        return: Response: Serialized label data or error message.
        """
        try:
            data = request.data.copy()  # Create a copy of the request data
            data['user'] = request.user.id
            logger.info(f"Request Data: {data}")  # Log the data being sent to the serializer
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as exc:
            logger.error(f"Exception: {exc}")
            return self.handle_exception(exc)

    def retrieve(self, request, *args, **kwargs):
        """
        desc: Retrieves a specific label for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the label.
        return: Response: Serialized label data or error message.
        """
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)

    def update(self, request, *args, **kwargs):
        """
        desc: Updates a specific label for the authenticated user.
        params:
            request (Request): The HTTP request object with label data.
            pk (int): Primary key of the label.
        return: Response: Serialized label data or error message.
        """
        try:
            # Retrieve the label instance to be updated
            label_instance = self.get_object()
            
            # Check if the label belongs to the authenticated user
            if label_instance.user != request.user:
                return Response({
                    'message': 'You do not have permission to update this label',
                    'status': 'error',
                    'errors': 'Permission denied'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Create a new dictionary with the user field included
            data = request.data.copy()  # Create a copy of the request data
            data['user'] = request.user.id
            
            # Ensure that the serializer updates the instance
            serializer = self.get_serializer(label_instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            # Return the updated label data
            return Response(serializer.data)
    
        except Exception as exc:
            logger.error(f"Exception: {exc}")
            return self.handle_exception(exc)


    def destroy(self, request, *args, **kwargs):
        """
        desc: Deletes a specific label for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the label.
        return: Response: Empty response or error message.
        """
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)

    def list(self, request, *args, **kwargs):
        """
        desc: Fetches all labels for the authenticated user.
        params: request (Request): The HTTP request object.
        return: Response: Serialized list of labels or error message.
        """
        try:
            return super().list(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)
