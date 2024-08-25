from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from django.db import DatabaseError
from loguru import logger

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing, editing, archiving, and trashing user notes.

    desc: Handles CRUD operations and custom actions for user notes.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        desc: Fetches all notes for the authenticated user.
        params: request (Request): The HTTP request object.
        return: Response: Serialized list of notes or error message.
        """
        try:
            queryset = Note.objects.filter(user=request.user)
            serializer = NoteSerializer(queryset, many=True)
            return Response(serializer.data)
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

    def create(self, request):
        """
        desc: Creates a new note for the authenticated user.
        params: request (Request): The HTTP request object with note data.
        return: Response: Serialized note data or error message.
        """
        try:
            serializer = NoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
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
            note = Note.objects.get(pk=pk, user=request.user)
            serializer = NoteSerializer(note)
            return Response(serializer.data)
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
            serializer.save()
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

    def destroy(self, request, pk=None):
        """
        desc: Deletes a specific note for the authenticated user.
        params:
            request (Request): The HTTP request object.
            pk (int): Primary key of the note.
        return: Response: Empty response or error message.
        """
        try:
            note = Note.objects.get(pk=pk, user=request.user)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
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
            note = Note.objects.get(pk=pk, user=request.user)
            note.is_archive = not note.is_archive
            note.save()
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
            queryset = Note.objects.filter(user=request.user, is_archive=True)
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
            note = Note.objects.get(pk=pk, user=request.user)
            note.is_trash = not note.is_trash
            note.save()
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
            queryset = Note.objects.filter(user=request.user, is_trash=True)
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
