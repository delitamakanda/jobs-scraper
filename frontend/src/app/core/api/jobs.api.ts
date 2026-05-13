import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { JobOffer } from '../../shared/models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobsApi {
  private readonly api = inject(ApiService);

  getJobs() {
    return this.api.get('/jobs');
  }

  getJob(id: string) {
    return this.api.get(`/jobs/${id}`);
  }

  createJob(data: JobOffer) {
    return this.api.post('/jobs', data);
  }
}
