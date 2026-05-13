import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const access_token = localStorage.getItem('access_token');
  const router = inject(Router);

  if (!access_token) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  return true;
};
