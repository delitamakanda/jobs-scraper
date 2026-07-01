import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { authInterceptor } from '@app/core/auth/auth.interceptor';
import { API_CONFIG_TOKEN } from '@app/core/config/injection-token';
import { API_CONFIG } from '@app/core/config/api.config';
import { CsrfService } from '@app/core/auth/csrf.service';
import { AuthStore } from '@app/core/state/auth.store';
import { loadingInterceptor } from '@app/core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    { provide: API_CONFIG_TOKEN, useValue: API_CONFIG },
    // Fetch a CSRF token, then hydrate the auth session from the httpOnly
    // cookie before the app renders, so route guards see the correct state.
    provideAppInitializer(() => {
      const csrf = inject(CsrfService);
      const auth = inject(AuthStore);
      return csrf.load().pipe(switchMap(() => auth.loadSession()));
    }),
  ]
};
