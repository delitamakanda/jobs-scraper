import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CsrfService } from './csrf.service';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * - Sends the httpOnly auth cookie with every request (`withCredentials`),
 *   including cross-site in production.
 * - Attaches the CSRF token (`X-CSRFToken`) on state-changing requests for the
 *   double-submit protection. No `Authorization` header, no localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const csrf = inject(CsrfService);

  let authReq = req.clone({ withCredentials: true });

  if (!SAFE_METHODS.has(req.method.toUpperCase())) {
    const token = csrf.current();
    if (token) {
      authReq = authReq.clone({ setHeaders: { 'X-CSRFToken': token } });
    }
  }

  return next(authReq);
};
