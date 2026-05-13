from rest_framework import serializers
from apps.jobs.models import JobMatch, JobOffer

class ImportJobUrlSerializer(serializers.Serializer):
    url = serializers.URLField()

    def validate_url(self, value):
        return value.strip()
    
    def create(self, validated_data):
        return validated_data
    

class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = '__all__'
        read_only_fields = [
            'user',
            'source',
            'required_skills',
            'nice_to_have_skills',
            'ai_summary',
            'red_flag',
            'created_at',
            'updated_at',
        ]


class JobMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = '__all__'
        read_only_fields = [
            'created_at',
        ]