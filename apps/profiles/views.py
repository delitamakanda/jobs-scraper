from rest_framework import permissions
from apps.profiles.models import Candidate
from rest_framework.generics import RetrieveUpdateAPIView
from apps.profiles.serializers import CandidateSerializer
    
class CandidateDetailView(RetrieveUpdateAPIView):
    serializer_class = CandidateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        queryset = Candidate.objects.filter(user=self.request.user)
        obj = queryset.first()
        return obj