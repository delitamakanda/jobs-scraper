from rest_framework import serializers
from apps.jobs.models import JobMatch, JobOffer

class ImportJobUrlSerializer(serializers.Serializer):
    url = serializers.URLField()

    def validate_url(self, value):
        return value.strip()
    
    def create(self, validated_data):
        return validated_data
    

class JobMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobMatch
        fields = '__all__'
        read_only_fields = [
            'created_at',
        ]
    

class JobOfferSerializer(serializers.ModelSerializer):
    match = serializers.SerializerMethodField()
    class Meta:
        model = JobOffer
        fields = [
            'id',
            'title',
            'company',
            'location',
            'url',
            'source',
            'required_skills',
            'nice_to_have_skills',
            'ai_summary',
            'red_flag',
            'created_at',
            'updated_at',
            'match',
        ]
        read_only_fields = [
            'user',
            'source',
            'required_skills',
            'nice_to_have_skills',
            'ai_summary',
            'red_flag',
            'created_at',
            'updated_at',
            'match',
        ]

    def get_match(self, obj):
        match_per_job_offer = JobMatch.objects.filter(job_offer=obj)
        if match_per_job_offer.exists():
            return JobMatchSerializer(match_per_job_offer.first()).data
        return None
