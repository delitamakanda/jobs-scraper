"""Cookie-based DRF token authentication.

The auth token is delivered to and read from an ``httpOnly`` cookie instead of
the ``Authorization`` header, so it is never exposed to JavaScript (no
``localStorage``). Because the browser attaches the cookie automatically, this
scheme is vulnerable to CSRF, so we enforce Django's CSRF protection on unsafe
HTTP methods — exactly like DRF's ``SessionAuthentication``.
"""

from django.conf import settings
from rest_framework.authentication import SessionAuthentication, TokenAuthentication


class CookieTokenAuthentication(TokenAuthentication):
    """Authenticate using the DRF token stored in an httpOnly cookie.

    If the cookie is absent we return ``None`` so DRF can fall through to the
    next authenticator (the header-based ``TokenAuthentication`` kept for
    non-browser/API clients).
    """

    def authenticate(self, request):
        token = request.COOKIES.get(settings.AUTH_COOKIE_NAME)
        if not token:
            return None

        user_auth_tuple = self.authenticate_credentials(token)
        # Cookie auth is CSRF-exposed; enforce the double-submit token on
        # unsafe methods (no-op for GET/HEAD/OPTIONS).
        enforce_csrf(request)
        return user_auth_tuple


def enforce_csrf(request):
    """Run Django/DRF CSRF validation. No-op on safe methods."""
    SessionAuthentication().enforce_csrf(request)


def _cookie_kwargs():
    return {
        "max_age": settings.AUTH_COOKIE_MAX_AGE,
        "domain": settings.AUTH_COOKIE_DOMAIN,
        "path": settings.AUTH_COOKIE_PATH,
        "secure": settings.AUTH_COOKIE_SECURE,
        "httponly": True,
        "samesite": settings.AUTH_COOKIE_SAMESITE,
    }


def set_auth_cookie(response, token_key):
    """Attach the httpOnly auth-token cookie to ``response``."""
    response.set_cookie(settings.AUTH_COOKIE_NAME, token_key, **_cookie_kwargs())
    return response


def delete_auth_cookie(response):
    """Clear the auth-token cookie (used on logout)."""
    response.delete_cookie(
        settings.AUTH_COOKIE_NAME,
        path=settings.AUTH_COOKIE_PATH,
        domain=settings.AUTH_COOKIE_DOMAIN,
        samesite=settings.AUTH_COOKIE_SAMESITE,
    )
    return response
