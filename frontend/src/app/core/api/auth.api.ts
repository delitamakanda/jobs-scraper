import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RegisterUser } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private readonly api = inject(ApiService);

  login(username: string, password: string) {
    return this.api.post('auth/login', { username, password });
  }

  logout() {
    return this.api.post('auth/logout', {});
  }

  signup(data: RegisterUser) {
    return this.api.post('auth/signup', data);
  }
}
