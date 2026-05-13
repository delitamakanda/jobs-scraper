from rest_framework.routers import DefaultRouter
from apps.jobs.views import JobOfferViewSet

router = DefaultRouter()

router.register(r'', JobOfferViewSet, basename='joboffer')

urlpatterns = router.urls