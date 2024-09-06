from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import DatabaseError
from loguru import logger

from .models import Label
from .serializers import LabelSerializer
from drf_yasg.utils import swagger_auto_schema


class LabelViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """
    A viewset for viewing, creating, updating, and deleting labels.

    Handles CRUD operations for user labels with JWT authentication and logging.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

    def get_queryset(self):
        """
        Limits queryset to the authenticated user's labels.

        Returns:
            QuerySet: Filtered queryset of labels.
        """
        try:
            return self.queryset.filter(user=self.request.user)
        except Exception as exc:
            logger.error(f"Exception: {exc}")
            return self.handle_exception(exc)

    def handle_exception(self, exc):
        """
        Custom exception handler to log errors and return a formatted response.

        Args:
            exc (Exception): The caught exception.

        Returns:
            Response: The formatted error response.
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

    @swagger_auto_schema(
        operation_description="Create a new label",
        request_body=LabelSerializer,
        responses={201: LabelSerializer,
                   400: "Bad Request: Invalid input data.", 500: "Internal Server Error."}
    )
    def create(self, request, *args, **kwargs):
        """
        Creates a new label for the authenticated user.

        Args:
            request (Request): The HTTP request object with label data.

        Returns:
            Response: Serialized label data or error message.
        """
        try:
            data = request.data.copy()
            data['user'] = request.user.id
            logger.info(f"Request Data: {data}")

            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as exc:
            logger.error(f"Exception: {exc}")
            return self.handle_exception(exc)

    @swagger_auto_schema(
        operation_description="Retrieve a label",
        responses={200: LabelSerializer,
                   404: "Not Found: Label not found.", 500: "Internal Server Error."}
    )
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieves a specific label for the authenticated user.

        Args:
            request (Request): The HTTP request object.
            pk (int): Primary key of the label.

        Returns:
            Response: Serialized label data or error message.
        """
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as exc:
            logger.info(f"label: zz {type(exc)}")
            return Response({
                'message': 'Label not found',
                'status': 'error',
                'errors': str(exc)
            }, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        operation_description="Update a label",
        request_body=LabelSerializer,
        responses={200: LabelSerializer, 400: "Bad Request: Invalid input data.",
                   403: "Forbidden: Permission denied.", 500: "Internal Server Error."}
    )
    def update(self, request, *args, **kwargs):
        """
        Updates a specific label for the authenticated user.

        Args:
            request (Request): The HTTP request object with label data.
            pk (int): Primary key of the label.

        Returns:
            Response: Serialized label data or error message.
        """
        try:
            label_instance = self.get_object()

            if label_instance.user != request.user:
                return Response({
                    'message': 'You do not have permission to update this label',
                    'status': 'error',
                    'errors': 'Permission denied'
                }, status=status.HTTP_403_FORBIDDEN)

            data = request.data.copy()
            data['user'] = request.user.id

            serializer = self.get_serializer(
                label_instance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)

        except Exception as exc:
            logger.error(f"Exception: {exc}")
            return self.handle_exception(exc)

    @swagger_auto_schema(
        operation_description="Delete a label",
        responses={204: "No Content: Label deleted successfully.",
                   404: "Not Found: Label not found.", 500: "Internal Server Error."}
    )
    def destroy(self, request, *args, **kwargs):
        """
        Deletes a specific label for the authenticated user.

        Args:
            request (Request): The HTTP request object.
            pk (int): Primary key of the label.

        Returns:
            Response: Empty response or error message.
        """
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)

    @swagger_auto_schema(
        operation_description="List all labels",
        responses={200: LabelSerializer(
            many=True), 500: "Internal Server Error."}
    )
    def list(self, request, *args, **kwargs):
        """
        Fetches all labels for the authenticated user.

        Args:
            request (Request): The HTTP request object.

        Returns:
            Response: Serialized list of labels or error message.
        """
        try:
            return super().list(request, *args, **kwargs)
        except Exception as exc:
            return self.handle_exception(exc)
