import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JobOffer } from '../../shared/models/job.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobsApi {
  private readonly api = inject(ApiService);

  getJobs(): Observable<JobOffer[]> {
    return this.api.get('jobs/');
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
