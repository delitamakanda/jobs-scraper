import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApi } from '../api/auth.api';
import { RegisterUser } from '../../shared/models/auth.model';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

export const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly api = inject(AuthApi);
  
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly token = this._token.asReadonly();

  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    const ACCESS_TOKEN = localStorage.getItem(AUTH_TOKEN_KEY || null);
    this._token.set(ACCESS_TOKEN);
  }

  login(username: string, password: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);
    
    return this.api.login(username, password).pipe(
      tap((response: any) => {
        this._token.set(response.token);
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      }),
      catchError((error: any) => {
        this._error.set(error.message || 'An error occurred');
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
        this._token.set(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }),
      catchError((error: any) => {
        this._error.set(error.message || 'An error occurred');
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

    signup(data: RegisterUser): Observable<void> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.signup(data).pipe(
      tap((response: any) => {
        this._token.set(response.token);
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      }),
      catchError((error: any) => {
        this._error.set(error.message || 'An error occurred');
        return throwError(() => error);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }
  
}
