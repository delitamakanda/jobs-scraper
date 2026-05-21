import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_TOKEN_KEY } from '../state/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  return true;
};
