import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsState } from '../../../core/state/jobs.state';
import { JobOffer } from '../../../shared/models/job.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-jobs-list',
  imports: [
    AsyncPipe,
    RouterLink
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
}
