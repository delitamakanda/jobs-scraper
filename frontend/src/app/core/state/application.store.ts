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

  private _questions = signal<string[]>([]);
  private _mockAnswers = signal<string[]>([]);
  private _recommendedTopics = signal<string[]>([]);
  private _weakPoints = signal<string[]>([]);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly applications = this._applications.asReadonly();
  readonly selectedApplication = this._selectedApplication.asReadonly();
  readonly content = this._content.asReadonly();

  readonly questions = this._questions.asReadonly();
  readonly mockAnswers = this._mockAnswers.asReadonly();
  readonly recommendedTopics = this._recommendedTopics.asReadonly();
  readonly weakPoints = this._weakPoints.asReadonly();

  readonly savedApplications = computed(() => this._applications().filter((application) => application.status === 'SAVED'));

  readonly interviewApplications = computed(() => this._applications().filter((application) => application.status === 'INTERVIEW'));

  fetchApplications(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getApplications().pipe(
      tap((applications: Application[]) => {
        console.log('Fetched applications:', applications);
        this._applications.set(applications);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to fetch applications');
        this._loading.set(false);
        return throwError(() => err);
      })
    ).subscribe();
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
    tone: 'formal' | 'informal' | 'friendly',
    format: 'linkedin' | 'email' | 'short_letter',
    language: 'fr' | 'en' | 'es',
    max_length: 'short' | 'medium' | 'long',
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
      focus: string[],
      difficulty: 'senior' | 'mid' | 'expert',
      language: 'fr' | 'en' | 'es',
    }): Observable<{ message: string; data: { content: {
      mock_answers: string[];
      questions: string[];
      weak_points: string[];
      recommended_topics: string[];
    } };}> {
      this._loading.set(true);
      this._error.set(null);
      return this.api.generateInterviewPreparation(id, options).pipe(
        tap((response) => {
          this._questions.set(response.data.content.questions);
          this._mockAnswers.set(response.data.content.mock_answers);
          this._recommendedTopics.set(response.data.content.recommended_topics);
          this._weakPoints.set(response.data.content.weak_points);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set('Failed to generate interview preparation');
          this._loading.set(false);
          return throwError(() => err);
        })
      );
    }

    updateApplicationStatus(applicationId: number, newStatus: Application['status']): Observable<Application> {
      this._loading.set(true);
      this._error.set(null);
      return this.api.updateApplication(applicationId, { status: newStatus } as Application).pipe(
        tap((updatedApplication) => {
          const applications = this._applications();
          const updatedApplications = applications.map((application) => application.id === applicationId ? updatedApplication : application);
          this._applications.set(updatedApplications);
          this._loading.set(false);
        }),
        catchError((err) => {
          this._error.set('Failed to update application status');
          this._loading.set(false);
          return throwError(() => err);
        })
      );
    }
}
