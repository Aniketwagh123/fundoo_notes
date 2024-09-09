from rest_framework import serializers
from .models import Label

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name', 'color']
   
        read_only_fields = ["user"] 
        # Correct way to specify write-only fields

        
        
