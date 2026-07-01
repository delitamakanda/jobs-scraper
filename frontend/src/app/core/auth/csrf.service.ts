import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from '../api/api.service';

/**
 * Holds the CSRF token used for the double-submit protection.
 *
 * The token is delivered in the *body* of `GET /auth/csrf/` (a cross-domain
 * SPA cannot read the API's `csrftoken` cookie), kept in memory here, and
 * echoed back in the `X-CSRFToken` header by the auth interceptor on unsafe
 * requests. The browser sends the matching cookie automatically.
 */
@Injectable({ providedIn: 'root' })
export class CsrfService {
  private readonly api = inject(ApiService);
  private readonly _token = signal<string | null>(null);

  readonly token = this._token.asReadonly();

  /** Fetch and cache a CSRF token. Resolves to null if the request fails. */
  load(): Observable<string | null> {
    return this.api.get<{ csrfToken: string }>('auth/csrf/').pipe(
      map((res) => res.csrfToken),
      tap((token) => this._token.set(token)),
      catchError(() => {
        this._token.set(null);
        return of(null);
      }),
    );
  }

  current(): string | null {
    return this._token();
  }
}
