from rest_framework import serializers
from .models import Note
from loguru import logger
from datetime import datetime
import pytz

class NoteSerializer(serializers.ModelSerializer):
    # def validate_reminder(self, value):
    #     if not value:
    #         return None  # Or handle as needed if `None` is not allowed
        
    #     if isinstance(value, datetime):
    #         local_time = value
    #     else:
    #         try:
    #             # Convert string to datetime object
    #             local_time = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    #         except ValueError as e:
    #             logger.error(f"Error parsing time string: {e}")
    #             raise serializers.ValidationError("Invalid datetime format. Expected format: YYYY-MM-DD HH:MM:SS")

    #     # Set the timezone to IST (Indian Standard Time)
    #     ist = pytz.timezone('Asia/Kolkata')
    #     if local_time.tzinfo is None:  # If naive datetime, localize it
    #         local_time = ist.localize(local_time)

    #     # Convert the local time to UTC
    #     utc_time = local_time.astimezone(pytz.utc)

    #     # Log the UTC time
    #     logger.info(f"UTC time: {utc_time.strftime('%Y-%m-%d %H:%M:%S')}")

    #     return utc_time

    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['user']
