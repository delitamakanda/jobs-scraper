from rest_framework import serializers
from apps.applications.models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']