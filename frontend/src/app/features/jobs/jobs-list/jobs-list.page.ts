import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsState } from '../../../core/state/jobs.state';
import { JobOffer } from '../../../shared/models/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-jobs-list',
  imports: [
    AsyncPipe,
    RouterLink,
    DatePipe,
  ],
  providers: [
    JobsState,
  ],
  templateUrl: './jobs-list.page.html',
  styleUrls: ['./jobs-list.page.css'],
})
export class JobsListPage {
  private readonly store = inject(JobsState);

  protected jobs$!: Observable<JobOffer[]>;

  ngOnInit() {
    this.jobs$ = this.store.loadJobs();
  }

  deleteJob(id: number) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.store.deleteJob(id).subscribe({
        next: () => {
          alert('Job deleted successfully');
          this.jobs$ = this.store.loadJobs(); // Refresh the list after deletion
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('Failed to delete job');
        }
      });
    }
  }
}
