from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from apps.accounts.authentication import (
    delete_auth_cookie,
    enforce_csrf,
    set_auth_cookie,
)
from apps.accounts.serializers import LoginSerializer, RegisterSerializer


def user_payload(user):
    """Public, non-sensitive representation of the authenticated user."""
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        enforce_csrf(request)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        response = Response(user_payload(user), status=status.HTTP_200_OK)
        return set_auth_cookie(response, token.key)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        enforce_csrf(request)
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        response = Response(user_payload(user), status=status.HTTP_201_CREATED)
        return set_auth_cookie(response, token.key)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        response = Response(status=status.HTTP_204_NO_CONTENT)
        return delete_auth_cookie(response)


class MeView(APIView):
    """Return the current user so the SPA can hydrate auth state on load."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(user_payload(request.user), status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name='get')
class CsrfView(APIView):
    """Bootstrap CSRF for the SPA.

    Sets the ``csrftoken`` cookie AND returns the token in the body, because a
    cross-domain SPA (e.g. github.io calling api.careeragent.dev) cannot read a
    cookie set for the API's domain. The SPA keeps the token in memory and
    echoes it in the ``X-CSRFToken`` header on unsafe requests.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'csrfToken': get_token(request)}, status=status.HTTP_200_OK)
