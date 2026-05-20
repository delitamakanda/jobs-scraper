import { computed, inject, Injectable, signal } from '@angular/core';
import { ApplicationsApi } from '../api/applications.api';
import { Application } from '../../shared/models/application.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStore {
  private readonly api = inject(ApplicationsApi);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null)
  private _applications = signal<Application[]>([]);
  private _selectedApplication = signal<Application | null>(null);
  private _content = signal<string>('');

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly applications = this._applications.asReadonly();
  readonly selectedApplication = this._selectedApplication.asReadonly();
  readonly content = this._content.asReadonly();

  readonly savedApplications = computed(() => this._applications().filter((application) => application.status === 'SAVED'));

  readonly interviewApplications = computed(() => this._applications().filter((application) => application.status === 'INTERVIEW'));

  fetchApplications(): Observable<Application[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.getApplications().pipe(
      tap((applications: Application[]) => {
        console.log('Fetched applications:', applications);
        this._applications.set(applications);
        this._loading.set(false);
      })
    );
  }

  createApplication(data: Application): Observable<Application> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.createApplication(data).pipe(
      tap((application) => {
        console.log('Created application:', application);
        const currentApplications = this._applications();
        this._applications.set([...currentApplications, application]);
        this._loading.set(false);
      })
    );
  }

  generateCoverletter(id: number, options: {
    tone?: 'formal' | 'neutral',
    format?: 'linkedin' | 'pdf',
    language?: 'fr' | 'en',
    max_length?: 'short' | 'medium' | 'long',
  }): Observable<{ message: string; data: { content: string };}> {
      this._loading.set(true);
      this._error.set(null);
      return this.api.generateCoverletter(id, options).pipe(
        tap((response) => {
          this._content.set(response.data.content);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set('Failed to generate cover letter');
          this._loading.set(false);
          return throwError(() => err);
        })
      );
    };

    generateInterviewPreparation(id: number, options: {
      focus?: [
        'angular_architecture',
        'signals',
        'testing',
        'migration',
      ],
      difficulty?: 'senior' | 'mid' | 'junior',
      language?: 'fr' | 'en',
    }): Observable<{ message: string; data: { content: string };}> {
      this._loading.set(true);
      this._error.set(null);
      return this.api.generateInterviewPreparation(id, options).pipe(
        tap((response) => {
          this._content.set(response.data.content);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set('Failed to generate interview preparation');
          this._loading.set(false);
          return throwError(() => err);
        })
      );
    }
}
