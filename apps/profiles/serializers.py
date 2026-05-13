from rest_framework import serializers
from django.contrib.auth.models import User
from apps.profiles.models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'full_name',
            'email',
        ]

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_email(self, obj):
        return obj.user.email