from rest_framework.routers import DefaultRouter
from apps.accounts.views import LoginView, RegisterView, LogoutView
from django.urls import path

router = DefaultRouter()

urlpatterns = router.urls

urlpatterns += [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
]