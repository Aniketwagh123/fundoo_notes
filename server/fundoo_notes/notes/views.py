import json
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from django.db.models import Q
from loguru import logger

from user.models import User
from .models import Collaborator, Note
from .serializers import NoteSerializer
from .utils import schedule_reminder
from utils.redisUtils import RedisUtils
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from label.models import Label


class NoteViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing, editing, archiving, and trashing user notes.

    desc: Handles CRUD operations and custom actions for user notes.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis = RedisUtils()

    def list(self, request):
        """
        desc: Fetches all notes for the authenticated user, including collaborative notes.
        params: request (Request): The HTTP request object.
        return: Response: Serialized list of notes or error message.
        """
        try:
            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)

            if notes_data:
                logger.info("Returning notes from cache.")
                notes_data = json.loads(notes_data)  # type: ignore
            else:
                queryset = Note.objects.filter(
                    Q(user=request.user) | Q(collaborator__user=request.user),
                    is_archive=False,
                    is_trash=False
                ).distinct() 
                serializer = NoteSerializer(queryset, many=True)
                notes_data = serializer.data
                logger.info(f"info {notes_data}")

                notes_data_str = json.dumps(notes_data)
                self.redis.save(cache_key, notes_data_str)

            return Response({
                "message": "Notes retrieved successfully",
                "status": "success",
                "data": notes_data
            })

        except DatabaseError as e:
            logger.error(f"Database error while fetching notes: {e}")
            return Response(
                {
                    'message': 'Failed to fetch notes',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error while fetching notes: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_description="Creation of note",
        request_body=NoteSerializer,
        responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                   500: "Internal Server Error: An error occurred during Creating note."}
    )
    def create(self, request):
        """
        desc: Creates a new note for the authenticated user.
        params: request (Request): The HTTP request object with note data.
        return: Response: Serialized note data or error message.
        """
        try:
            serializer = NoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            note = serializer.save(user=request.user)
            # Schedule the task if a reminder is set
            if note.reminder:  # type: ignore
                schedule_reminder(note)  # type: ignore

            self.redis.delete(f"user_{request.user.id}")

            return Response({
                "message": "Note created successfully",
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)

        except DatabaseError as e:
            logger.error(f"Database error while creating note: {e}")
            return Response(
                {
                    'message': 'Failed to create note',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error while creating note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None):
        """
        desc: Retrieves a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Serialized note data or error message.
        """
        try:
            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)

            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
                note_data = next(
                    (note for note in notes_data if note['id'] == int(pk)), None)  # type: ignore
                if note_data:
                    logger.info(f"Returning note {pk} from cache.")
                    return Response({
                        "message": "Note retrieved successfully",
                        "status": "success",
                        "data": note_data
                    })
                else:
                    raise ObjectDoesNotExist

            note = Note.objects.get(
                Q(pk=pk) & (Q(user=request.user) | Q(collaborator__user=request.user))
            )
            serializer = NoteSerializer(note)
            note_data = serializer.data

            self.redis.save(cache_key, json.dumps(note_data))
            return Response({
                "message": "Note retrieved successfully",
                "status": "success",
                "data": note_data
            })

        except ObjectDoesNotExist:
            logger.warning(f"The requested note with id {pk} does not exist.")
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            logger.error(f"Database error while retrieving note: {e}")
            return Response(
                {
                    'message': 'Failed to retrieve note',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error while retrieving note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_description="Updation of note",
        request_body=NoteSerializer,
        responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                   500: "Internal Server Error: An error occurred during updating note."}
    )
    def update(self, request, pk=None):
        """
        desc: Updates a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object with note data.
            pk (int): Primary key of the note.
        return: Response: Serialized note data or error message.
        """
        try:
            note = Note.objects.get(
                Q(pk=pk) & (Q(user=request.user) | Q(collaborator__user=request.user))
            )
            serializer = NoteSerializer(note, data=request.data)
            serializer.is_valid(raise_exception=True)
            note = serializer.save()

            if note.reminder:  # type: ignore
                schedule_reminder(note)  # type: ignore

            self.redis.delete(f"user_{request.user.id}")

            return Response({
                "message": "Note updated successfully",
                "status": "success",
                "data": serializer.data
            })

        except ObjectDoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            logger.error(f"Database error while updating note: {e}")
            return Response(
                {
                    'message': 'Failed to update note',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error while updating note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        operation_description="Deletion of note",
        request_body=NoteSerializer,
        responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                   500: "Internal Server Error: An error occurred during deleting note."}
    )
    def destroy(self, request, pk=None):
        """
        desc: Deletes a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Success message or error message.
        """
        try:
            note = Note.objects.get(
                Q(pk=pk) & (Q(user=request.user) | Q(collaborator__user=request.user))
            )
            note.delete()

            self.redis.delete(f"user_{request.user.id}")

            return Response({
                "message": "Note deleted successfully",
                "status": "success"
            })

        except ObjectDoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            logger.error(f"Database error while deleting note: {e}")
            return Response(
                {
                    'message': 'Failed to delete note',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error while deleting note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    @swagger_auto_schema(operation_description="Archive note", request_body=NoteSerializer, responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                       500: "Internal Server Error: An error occurred during archive note."})
    @action(detail=True, methods=['patch'])
    def is_archive(self, request, pk=None):
        """
        desc: Toggles the archive status of a specific note.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Updated note data or error message.
        """
        try:
            note = Note.objects.get(
                Q(pk=pk) & (Q(user=request.user) | Q(collaborator__user=request.user))
            )
            note.is_archive = not note.is_archive
            note.save()
            self.redis.delete(f"user_{request.user.id}")
            serializer = NoteSerializer(note, raise_exception=True)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            logger.error(f"Database error while toggling archive status: {e}")
            return Response(
                {
                    'message': 'Failed to toggle archive status',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(
                f"Unexpected error while toggling archive status: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def archived(self, request):
        """
        desc: Fetches all archived notes for the authenticated user.
        params: request (Request): The HTTP request object.
        return: Response: Serialized list of archived notes or error message.
        """
        try:
            
            queryset = Note.objects.filter(Q(is_archive=True) &  (Q(user=request.user) | Q(collaborator__user=request.user)))
            serializer = NoteSerializer(queryset, many=True)
            return Response(serializer.data)
        except DatabaseError as e:
            logger.error(f"Database error while fetching archived notes: {e}")
            return Response(
                {
                    'message': 'Failed to fetch archived notes',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(
                f"Unexpected error while fetching archived notes: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['patch'])
    def is_trash(self, request, pk=None):
        """
        desc: Toggles the trash status of a specific note.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Updated note data or error message.
        """
        try:
            note = Note.objects.get(
                Q(pk=pk) & (Q(user=request.user) | Q(collaborator__user=request.user))
            )
            note.is_trash = not note.is_trash
            note.save()
            self.redis.delete(f"user_{request.user.id}")
            serializer = NoteSerializer(note)
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except DatabaseError as e:
            logger.error(f"Database error while toggling trash status: {e}")
            return Response(
                {
                    'message': 'Failed to toggle trash status',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error while toggling trash status: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def trashed(self, request):
        """
        desc: Fetches all trashed notes for the authenticated user.
        params: request (Request): The HTTP request object.
        return: Response: Serialized list of trashed notes or error message.
        """
        try:
            queryset = Note.objects.filter(Q(is_trash=True) & (Q(user=request.user) | Q(collaborator__user=request.user)))
            serializer = NoteSerializer(queryset, many=True)
            return Response(serializer.data)
        except DatabaseError as e:
            logger.error(f"Database error while fetching trashed notes: {e}")
            return Response(
                {
                    'message': 'Failed to fetch trashed notes',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error while fetching trashed notes: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @swagger_auto_schema(
        operation_description="Add collaborators to a note",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'note_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'user_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
            }
        ),
        responses={
            200: "Collaborators added successfully",
            400: "Bad Request: Invalid input data.",
            404: "Not Found: Note not found.",
            500: "Internal Server Error: An error occurred during adding collaborators."
        }
    )
    @action(detail=False, methods=['post'])
    def add_collaborators(self, request):
        """
        desc: Adds collaborators to a specific note for the authenticated user.
        params: request (Request): The HTTP request object with note ID and list of user IDs.
        return: Response: Success message or error message.
        """
        try:
            self.redis.delete(f"user_{request.user.id}")
            note_id = request.data.get('note_id')
            user_ids = request.data.get('user_ids', [])

            if not isinstance(user_ids, list):
                return Response(
                    {'message': 'Invalid data format for user_ids', 'status': 'error'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch the note
            note = Note.objects.get(pk=note_id, user=request.user)

            # Exclude the owner from being a collaborator
            if request.user.id in user_ids:
                return Response(
                    {'message': 'Owner cannot be added as a collaborator', 'status': 'error'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch valid users from the user_ids
            users = User.objects.filter(pk__in=user_ids)
            valid_user_ids = {user.id for user in users} # type: ignore

            # Create a list of Collaborator objects to be created
            collaborators = [
                Collaborator(note=note, user=user, access_type=Collaborator.READ_WRITE)
                for user in users
            ]

            # Perform bulk creation
            Collaborator.objects.bulk_create(collaborators, ignore_conflicts=True)

            # Check if there were any invalid user_ids provided
            invalid_user_ids = set(user_ids) - valid_user_ids
            if invalid_user_ids:
                return Response(
                    {'message': f"Collaborators added successfully, but the following user_ids were not found: {list(invalid_user_ids)}", 'status': 'partial_success'},
                    status=status.HTTP_200_OK
                )

            return Response(
                {'message': 'Collaborators added successfully', 'status': 'success'},
                status=status.HTTP_200_OK
            )

        except Note.DoesNotExist:
            return Response(
                {'message': 'Note not found', 'status': 'error', 'errors': 'The requested note does not exist.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error while adding collaborators: {e}")
            return Response(
                {'message': 'An unexpected error occurred', 'status': 'error', 'errors': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        operation_description="Remove collaborators from a note",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'note_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'user_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
            }
        ),
        responses={
            200: "Collaborators removed successfully",
            400: "Bad Request: Invalid input data.",
            404: "Not Found: Note not found.",
            500: "Internal Server Error: An error occurred during removing collaborators."
        }
    )
    @action(detail=False, methods=['post'])
    def remove_collaborators(self, request):
        """
        desc: Removes collaborators from a specific note for the authenticated user.
        params: request (Request): The HTTP request object with note ID and list of user IDs.
        return: Response: Success message or error message.
        """
        try:
            self.redis.delete(f"user_{request.user.id}")
            note_id = request.data.get('note_id')
            user_ids = request.data.get('user_ids', [])

            if not isinstance(user_ids, list):
                return Response(
                    {'message': 'Invalid data format for user_ids', 'status': 'error'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch the note
            note = Note.objects.get(pk=note_id, user=request.user)

            # Delete collaborators in bulk
            deleted_count, _ = Collaborator.objects.filter(note=note, user__id__in=user_ids).delete()

            if deleted_count == 0:
                return Response(
                    {'message': 'No collaborators were removed. The provided user IDs may not be collaborators on this note.', 'status': 'error'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {'message': 'Collaborators removed successfully', 'status': 'success'},
                status=status.HTTP_200_OK
            )

        except Note.DoesNotExist:
            return Response(
                {'message': 'Note not found', 'status': 'error', 'errors': 'The requested note does not exist.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error while removing collaborators: {e}")
            return Response(
                {'message': 'An unexpected error occurred', 'status': 'error', 'errors': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    @swagger_auto_schema(
        method='post',
        operation_description="Add labels to a note",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'note_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'label_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
            }
        ),
        responses={
            200: "Labels added successfully",
            400: "Bad Request: Invalid input data.",
            404: "Not Found: Note or labels not found.",
            500: "Internal Server Error: An error occurred during adding labels."
        }
    )
    @action(detail=False, methods=['post'])
    def add_labels(self, request):
        """
        desc: Adds labels to a specific note.
        params: request (Request): The HTTP request object with note ID and list of label IDs.
        return: Response: Success message or error message.
        """
        self.redis.delete(f"user_{request.user.id}")
        note_id = request.data.get('note_id')
        label_ids = request.data.get('label_ids', [])

        if not note_id or not isinstance(label_ids, list):
            return Response(
                {'message': 'Invalid input data', 'status': 'error'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            note = Note.objects.get(pk=note_id, user=request.user)
            labels = Label.objects.filter(id__in=label_ids)
            note.labels.add(*labels)
            return Response(
                {'message': 'Labels added successfully', 'status': 'success'},
                status=status.HTTP_200_OK
            )

        except Note.DoesNotExist:
            return Response(
                {'message': 'Note not found', 'status': 'error', 'errors': 'The requested note does not exist.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error while adding labels: {e}")
            return Response(
                {'message': 'An unexpected error occurred', 'status': 'error', 'errors': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(
        method='post',
        operation_description="Remove labels from a note",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'note_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'label_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER))
            }
        ),
        responses={
            200: "Labels removed successfully",
            400: "Bad Request: Invalid input data.",
            404: "Not Found: Note or labels not found.",
            500: "Internal Server Error: An error occurred during removing labels."
        }
    )
    @action(detail=False, methods=['post'])
    def remove_labels(self, request):
        """
        desc: Removes labels from a specific note.
        params: request (Request): The HTTP request object with note ID and list of label IDs.
        return: Response: Success message or error message.
        """
        note_id = request.data.get('note_id')
        label_ids = request.data.get('label_ids', [])

        if not note_id or not isinstance(label_ids, list):
            return Response(
                {'message': 'Invalid input data', 'status': 'error'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            note = Note.objects.get(pk=note_id, user=request.user)
            labels = Label.objects.filter(id__in=label_ids)
            note.labels.remove(*labels)
            return Response(
                {'message': 'Labels removed successfully', 'status': 'success'},
                status=status.HTTP_200_OK
            )

        except Note.DoesNotExist:
            return Response(
                {'message': 'Note not found', 'status': 'error', 'errors': 'The requested note does not exist.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Unexpected error while removing labels: {e}")
            return Response(
                {'message': 'An unexpected error occurred', 'status': 'error', 'errors': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
