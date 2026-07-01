import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApi } from '../api/auth.api';
import { AuthUser, RegisterUser } from '../../shared/models/auth.model';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';

/**
 * Auth state derived from the httpOnly session cookie.
 *
 * The token itself is never held in JS (no localStorage). Instead we track the
 * authenticated user, hydrated on app start via {@link loadSession}. `providedIn:
 * 'root'` — do NOT re-provide this at the component level, or components would
 * get their own instance and lose the shared session state.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly api = inject(AuthApi);

  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _initialized = signal<boolean>(false);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly user = this._user.asReadonly();
  readonly initialized = this._initialized.asReadonly();

  readonly isLoggedIn = computed(() => !!this._user());

  /** Hydrate auth state from the session cookie. Called once on app init. */
  loadSession(): Observable<AuthUser | null> {
    return this.api.me().pipe(
      tap((user) => this._user.set(user)),
      catchError(() => {
        this._user.set(null);
        return of(null);
      }),
      finalize(() => this._initialized.set(true)),
    );
  }

  login(username: string, password: string): Observable<AuthUser> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.login(username, password).pipe(
      tap((user) => this._user.set(user)),
      catchError((error: any) => {
        this._error.set(error?.error?.detail || error?.message || 'An error occurred');
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  logout(): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.api.logout().pipe(
      tap(() => {
        this._user.set(null);
      }),
      catchError((error: any) => {
        this._error.set(error?.message || 'An error occurred');
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  signup(data: RegisterUser): Observable<AuthUser> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.signup(data).pipe(
      tap((user) => this._user.set(user)),
      catchError((error: any) => {
        this._error.set(error?.error?.detail || error?.message || 'An error occurred');
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }
}
