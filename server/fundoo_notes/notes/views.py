from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            # Filter notes by the authenticated user
            queryset = Note.objects.filter(user=request.user)
            serializer = NoteSerializer(queryset, many=True)
            return Response(serializer.data) 
        # change format also add status code
        except Exception as e:
            return Response(
                {
                    'message': 'An unexpected error occurred during verification',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        try:
            # Include the authenticated user when creating a note
            serializer = NoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {
                    'message': 'An unexpected error occurred during verification',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None):
        try:
            # Retrieve the note belonging to the authenticated user
            note = Note.objects.get(pk=pk, user=request.user)
            serializer = NoteSerializer(note)
            return Response(serializer.data)
        except Note.DoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'message': 'An unexpected error occurred during verification',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, pk=None):
        try:
            # Update the note belonging to the authenticated user
            note = Note.objects.get(pk=pk, user=request.user)
            serializer = NoteSerializer(note, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Note.DoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'message': 'An unexpected error occurred during verification',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None):
        try:
            # Delete the note belonging to the authenticated user
            note = Note.objects.get(pk=pk, user=request.user)
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Note.DoesNotExist:
            return Response(
                {
                    'message': 'Note not found',
                    'status': 'error',
                    'errors': 'The requested note does not exist.'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'message': 'An unexpected error occurred during verification',
                    'status': 'error',
                    'errors': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
