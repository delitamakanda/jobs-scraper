from rest_framework import serializers
from apps.applications.models import Application
from apps.jobs.serializers import JobOfferSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    job_offer = JobOfferSerializer(read_only=True)
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'job_offer']
        