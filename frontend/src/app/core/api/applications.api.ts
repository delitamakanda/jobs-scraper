import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsApi {
  private readonly api = inject(ApiService);

  getApplications() {
    return this.api.get('applications');
  }

  getApplication(id: string) {
    return this.api.get(`applications/${id}`);
  }

  createApplication(data: any) {
    return this.api.post('applications', data);
  }

  updateApplication(id: string, data: any) {
    return this.api.put(`applications/${id}`, data);
  }

  deleteApplication(id: string) {
    return this.api.delete(`applications/${id}`);
  }
}
