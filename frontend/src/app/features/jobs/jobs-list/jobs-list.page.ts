import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsStore } from '../../../core/state/jobs.store';
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
    JobsStore,
  ],
  templateUrl: './jobs-list.page.html',
  styleUrls: ['./jobs-list.page.css'],
})
export class JobsListPage {
  private readonly store = inject(JobsStore);

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
