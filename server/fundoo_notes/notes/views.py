from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer

# TODO:only use viewset
class NoteViewSet(viewsets.ModelViewSet): 
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    