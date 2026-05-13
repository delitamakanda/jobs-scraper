from rest_framework import serializers
from django.contrib.auth.models import User
from apps.profiles.models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'
        read_only_fields = ('id',)