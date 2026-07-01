import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthUser, RegisterUser } from '../../shared/models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly api = inject(ApiService);

  login(username: string, password: string): Observable<AuthUser> {
    return this.api.post<AuthUser>('auth/login/', { username, password });
  }

  logout(): Observable<void> {
    return this.api.post<void>('auth/logout/', {});
  }

  signup(data: RegisterUser): Observable<AuthUser> {
    return this.api.post<AuthUser>('auth/register/', data);
  }

  /** Current user from the httpOnly session cookie; errors (401) when logged out. */
  me(): Observable<AuthUser> {
    return this.api.get<AuthUser>('auth/me/');
  }
}
