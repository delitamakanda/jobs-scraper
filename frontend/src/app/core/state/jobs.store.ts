import { inject, Injectable, signal } from '@angular/core';
import { JobsApi } from '../api/jobs.api';
import { JobOffer } from '../../shared/models/job.model';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class JobsStore {
  private readonly api = inject(JobsApi);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _jobs = signal<JobOffer[]>([]);
  private _selectedJob = signal<JobOffer | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly jobs = this._jobs.asReadonly();
  readonly selectedJob = this._selectedJob.asReadonly();

  loadJobs(): Observable<JobOffer[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.getJobs().pipe(
      tap((jobs: JobOffer[]) => {
        this._jobs.set(jobs);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to load jobs');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  getJob(id: number): Observable<JobOffer> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.getJob(id).pipe(
      tap((job) => {
        this._loading.set(false);
        this._selectedJob.set(job);
      }),
      catchError((err) => {
        this._error.set('Failed to load job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  createJob(data: JobOffer): Observable<JobOffer> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.createJob(data).pipe(
      tap((job: JobOffer) => {
        const currentJobs = this._jobs();
        this._jobs.set([...currentJobs, job]);
        this._selectedJob.set(job);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to create job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  deleteJob(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.deleteJob(id).pipe(
      tap(() => {
        const currentJobs = this._jobs();
        this._jobs.set(currentJobs.filter(job => job.id !== id));
        if (this._selectedJob()?.id === id) {
          this._selectedJob.set(null);
        }
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to delete job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  importFromUrl(url: string): Observable<JobOffer> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.importFromUrl(url).pipe(
      tap((job: JobOffer) => {
        const currentJobs = this._jobs();
        this._jobs.set([...currentJobs, job]);
        this._selectedJob.set(job);
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to import job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  analyzeJob(id: number): Observable<{message: string; analysis: any; job: JobOffer}> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.analyzeJob(id).pipe(
      tap(() => {
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to analyze job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }

  matchJob(id: number): Observable<{message: string; matches: any;}> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.matchJob(id).pipe(
      tap(() => {
        this._loading.set(false);
      }),
      catchError((err) => {
        this._error.set('Failed to match job');
        this._loading.set(false);
        return throwError(() => err);
      })
    );
  }
}
