import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../state/auth.store';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthStore);

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
