import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Profile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileApi {
  private readonly api = inject(ApiService);

  getProfile() {
    return this.api.get<Profile>('profile/me');
  }

  updateProfile(data: Partial<Profile>) {
    return this.api.patch<Profile>('profile/me/', data);
  }
}
