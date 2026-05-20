import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Application } from '../../shared/models/application.model';
import { Observable } from 'rxjs';

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

  generateCoverletter(id: number, data: {
    tone?: 'formal' | 'neutral',
    format?: 'linkedin' | 'pdf',
    language?: 'fr' | 'en',
    max_length?: 'short' | 'medium' | 'long',
  }): Observable<{ message: string; data: { content: string };}> {
      return this.api.post(`jobs/${id}/generate-cover-letter/`, data);
    }
  
    generateInterviewPreparation(id: number, data: {
      focus?: [
        'angular_architecture',
        'signals',
        'testing',
        'migration',
      ],
      difficulty?: 'senior' | 'mid' | 'junior',
      language?: 'fr' | 'en',
    }): Observable<{ message: string; data: { content: string };}> {
      return this.api.post(`jobs/${id}/generate-interview-prep/`, data);
    }

}
