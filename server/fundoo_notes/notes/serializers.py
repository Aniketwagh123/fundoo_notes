from rest_framework import serializers
from .models import Note
from loguru import logger
from datetime import datetime
import pytz

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['user']
