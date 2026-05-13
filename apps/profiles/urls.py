from rest_framework.routers import DefaultRouter, path
from apps.profiles.views import CandidateDetailView

router = DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path('me/', CandidateDetailView.as_view(), name='me'),
]