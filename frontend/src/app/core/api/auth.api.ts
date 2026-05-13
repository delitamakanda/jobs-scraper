import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RegisterUser } from '../../shared/models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly api = inject(ApiService);

  login(username: string, password: string): Observable<any> {
    return this.api.post('auth/login/', { username, password });
  }

  logout(): Observable<void> {
    return this.api.post('auth/logout/', {});
  }

  signup(data: RegisterUser): Observable<any> {
    return this.api.post('auth/register/', data);
  }
}
