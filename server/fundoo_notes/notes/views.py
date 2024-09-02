import json
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from loguru import logger

from user.models import User

from .utils import schedule_reminder
from utils.redisUtils import RedisUtils
from .models import Collaborator, Note
from .serializers import NoteSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Note
from drf_yasg import openapi

# TODO: retrive all nots of collaboraters also use Q object
# TODO: menytomeny for label and note
class NoteViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing, editing, archiving, and trashing user notes.

    desc: Handles CRUD operations and custom actions for user notes.
    """

    """ Swagger_atuo_schema()"""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.redis = RedisUtils()

    def list(self, request):
        """
        desc: Fetches all notes for the authenticated user.
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
                queryset = Note.objects.filter(user=request.user)
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

    @swagger_auto_schema(operation_description="Creation of note", request_body=NoteSerializer,
                         responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                    500: "Internal Server Error: An error occurred during Creating note."})
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
            # Schedule the task if reminder is set
            if note.reminder:  # type: ignore
                schedule_reminder(note)  # type: ignore

            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)
            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
            else:
                notes_data = []

            notes_data.append(serializer.data)
            self.redis.save(cache_key, json.dumps(notes_data))

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

            note = Note.objects.get(pk=pk, user=request.user)
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

    @swagger_auto_schema(operation_description="Updation of note", request_body=NoteSerializer, responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                           500: "Internal Server Error: An error occurred during updating note."})
    def update(self, request, pk=None):
        """
        desc: Updates a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object with note data.
            pk (int): Primary key of the note.
        return: Response: Serialized note data or error message.
        """
        try:
            note = Note.objects.get(pk=pk, user=request.user)
            serializer = NoteSerializer(note, data=request.data)
            serializer.is_valid(raise_exception=True)
            note = serializer.save()

            if note.reminder:  # type: ignore
                schedule_reminder(note)  # type: ignore

            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)
            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
                for idx, existing_note in enumerate(notes_data):
                    if existing_note['id'] == int(pk):  # type: ignore
                        notes_data[idx] = serializer.data
                        break

                self.redis.save(cache_key, json.dumps(notes_data))

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

    @swagger_auto_schema(operation_description="Deletion of note", request_body=NoteSerializer, responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                           500: "Internal Server Error: An error occurred during deleting note."})
    def destroy(self, request, pk=None):
        """
        desc: Deletes a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Success message or error message.
        """
        try:
            note = Note.objects.get(pk=pk, user=request.user)
            note.delete()

            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)
            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
                notes_data = [
                    note for note in notes_data if note['id'] != int(pk)]  # type: ignore

                self.redis.save(cache_key, json.dumps(notes_data))

            return Response({
                "message": "Note deleted successfully",
                "status": "success"
            }, status=status.HTTP_204_NO_CONTENT)

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
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            logger.error(f"Unexpected error while deleting note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @swagger_auto_schema(operation_description="Archive note", request_body=NoteSerializer, responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                       500: "Internal Server Error: An error occurred during archive note."})
    @action(detail=False, methods=['post'])
    def archive(self, request):
        """
        desc: Archives the specified note for the authenticated user.
        params: request (Request): The HTTP request object with note ID.
        return: Response: Success message or error message.
        """
        try:
            note_id = request.data.get('note_id')
            note = Note.objects.get(pk=note_id, user=request.user)
            note.is_archived = True  # type: ignore
            note.save()

            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)
            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
                for idx, existing_note in enumerate(notes_data):
                    if existing_note['id'] == int(note_id):
                        existing_note['is_archived'] = True
                        break

                self.redis.save(cache_key, json.dumps(notes_data))

            return Response({
                "message": "Note archived successfully",
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
            logger.error(f"Database error while archiving note: {e}")
            return Response(
                {
                    'message': 'Failed to archive note',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error while archiving note: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(operation_description="Trashed note", request_body=NoteSerializer, responses={201: NoteSerializer, 400: "Bad Request: Invalid input data.",
                                                                                                       500: "Internal Server Error: An error occurred during trashed not."})
    @action(detail=False, methods=['post'])
    def trash(self, request):
        """
        desc: Moves the specified note to trash for the authenticated user.
        params: request (Request): The HTTP request object with note ID.
        return: Response: Success message or error message.
        """
        try:
            note_id = request.data.get('note_id')
            note = Note.objects.get(pk=note_id, user=request.user)
            note.is_trashed = True  # type: ignore
            note.save()

            cache_key = f"user_{request.user.id}"
            notes_data = self.redis.get(cache_key)
            if notes_data:
                notes_data = json.loads(notes_data)  # type: ignore
                for idx, existing_note in enumerate(notes_data):
                    if existing_note['id'] == int(note_id):
                        existing_note['is_trashed'] = True
                        break

                self.redis.save(cache_key, json.dumps(notes_data))

            return Response({
                "message": "Note moved to trash successfully",
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
            logger.error(f"Database error while moving note to trash: {e}")
            return Response(
                {
                    'message': 'Failed to move note to trash',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error while moving note to trash: {e}")
            return Response(
                {
                    'message': 'An unexpected error occurred',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
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
