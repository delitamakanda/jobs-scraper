from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.jobs.models import JobOffer
from apps.jobs.serializers import JobOfferSerializer, ImportJobUrlSerializer
from apps.jobs.services.job_importer import import_job_from_url
from apps.ai.services.job_analyzer import analyze_job_offer
from apps.ai.services.matcher import match_job_with_profile

class JobOfferViewSet(viewsets.ModelViewSet):
    serializer_class = JobOfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobOffer.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='import-url')
    def import_url(self, request):
        serializer = ImportJobUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            job = import_job_from_url(
                url=serializer.validated_data['url'],
                user=request.user
            )
        except Exception as e:
            return Response({'detail': str(e), 'message': 'Import impossible'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        return Response(JobOfferSerializer(job).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        job = self.get_object()
        result = analyze_job_offer(job)
        return Response({
            'message': 'Job analysis completed',
            'analysis': result,
            'job': JobOfferSerializer(job).data
        })
    
    @action(detail=True, methods=['post'])
    def match(self, request, pk=None):
        job = self.get_object()
        result = match_job_with_profile(job, request.user)

        return Response({
            'message': 'Job matching completed',
            'match': result,
        })