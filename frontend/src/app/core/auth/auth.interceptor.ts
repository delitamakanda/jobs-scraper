import { HttpInterceptorFn } from '@angular/common/http';
import { AUTH_TOKEN_KEY } from '../state/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const acces_token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!acces_token) {
    return next(req);
  }
  
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Token ${acces_token}`,
    },
  });
  return next(authReq);
};
