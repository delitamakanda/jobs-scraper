import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const acces_token = localStorage.getItem('access_token');

  if (!acces_token) {
    return next(req);
  }
  
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Token ${acces_token}`)
  });
  return next(authReq);
};
