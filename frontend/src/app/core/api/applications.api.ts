import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Application } from '../../shared/models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsApi {
  private readonly api = inject(ApiService);

  getApplications() {
    return this.api.get<Application[]>('applications/');
  }

  getApplication(id: number) {
    return this.api.get<Application>(`applications/${id}/`);
  }

  createApplication(data: Application) {
    return this.api.post<Application>('applications/', data);
  }

  updateApplication(id: number, data: Application) {
    return this.api.put<Application>(`applications/${id}/`, data);
  }

  deleteApplication(id: number) {
    return this.api.delete(`applications/${id}/`);
  }
}
