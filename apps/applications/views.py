from rest_framework import viewsets, permissions
from apps.applications.models import Application
from apps.applications.serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(job_offer__user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        return super().perform_update(serializer)