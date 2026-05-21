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
    tone: 'formal' | 'informal' | 'friendly',
    format: 'linkedin' | 'email' | 'short_letter',
    language: 'fr' | 'en' | 'es',
    max_length: 'short' | 'medium' | 'long',
  }): Observable<{ message: string; data: { content: string };}> {
      return this.api.post(`jobs/${id}/generate-cover-letter/`, data);
    }
  
    generateInterviewPreparation(id: number, data: {
      focus: string[],
      difficulty: 'senior' | 'mid' | 'expert',
      language: 'fr' | 'en' | 'es',
    }): Observable<{ message: string; data: { content: {
      mock_answers: string[];
      questions: string[];
      weak_points: string[];
      recommended_topics: string[];
    } };}> {
      return this.api.post(`jobs/${id}/generate-interview-prep/`, {
        focus: data.focus,
        difficulty: data.difficulty,
        language: data.language,
      });
    }

}

