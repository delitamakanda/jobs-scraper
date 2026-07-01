import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '@app/core/services/error.service';
import { catchError } from 'rxjs/operators';
  
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error) => {
      errorService.handleError(error);
      throw error;
    })
  );
};
