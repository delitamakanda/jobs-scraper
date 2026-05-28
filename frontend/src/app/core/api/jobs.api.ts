import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JobOffer } from '../../shared/models/job.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobsApi {
  private readonly api = inject(ApiService);

  getJobs(): Observable<{ results: JobOffer[]; has_next: boolean; has_previous: boolean }> {
    return this.api.get('jobs/').pipe(
      map((response: any) => ({
        results: response.results as JobOffer[],
        has_next: response.has_next,
        has_previous: response.has_previous
      }))
    );
  }

  getJob(id: number): Observable<JobOffer> {
    return this.api.get(`jobs/${id}/`);
  }

  createJob(data: JobOffer): Observable<JobOffer> {
    return this.api.post('jobs/', data);
  }

  deleteJob(id: number): Observable<void> {
    return this.api.delete(`jobs/${id}/`);
  }

  importFromUrl(url: string): Observable<JobOffer> {
    return this.api.post('jobs/import-url/', { url });
  }

  analyzeJob(id: number): Observable<{message: string; analysis: any; job: JobOffer}> {
    return this.api.post(`jobs/${id}/analyze/`, {});
  }

  matchJob(id: number): Observable<{message: string; matches: any;}> {
    return this.api.post(`jobs/${id}/match/`, {});
  }

  generateCoverletter(id: number): Observable<{ message: string; data: { content: string };}> {
    return this.api.post(`jobs/${id}/generate-cover-letter/`, {});
  }

  generateInterviewPreparation(id: number): Observable<{ message: string; data: { content: string };}> {
    return this.api.post(`jobs/${id}/generate-interview-prep/`, {});
  }
}
