from rest_framework import viewsets, permissions
from apps.profiles.models import Candidate
from apps.profiles.serializers import CandidateSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class CandidateViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Candidate.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        return super().perform_update(serializer)
    
    @action(detail=False, methods=['get', 'post'], url_path='me')
    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.first()
        serializer = self.get_serializer(obj)
        return Response(serializer.data)