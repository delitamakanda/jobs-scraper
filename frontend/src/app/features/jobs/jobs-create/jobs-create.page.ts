import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobsState } from '../../../core/state/jobs.state';
import { JobOffer } from '../../../shared/models/job.model';

@Component({
  selector: 'app-jobs-create',
  imports: [
    ReactiveFormsModule
  ],
  providers: [JobsState],
  templateUrl: './jobs-create.page.html',
  styleUrl: './jobs-create.page.css',
})
export class JobsCreatePage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly store = inject(JobsState);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    company: ['', Validators.required],
    url: ['', Validators.required],
    raw_description: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      return;
    }
    
    const jobData = this.form.value;
    this.store.createJob(jobData as JobOffer).subscribe({
      next: (response) => {
        console.log('Job created successfully:', response.id);
        this.router.navigate(['/jobs', response.id]);
      },
      error: (error) => {
        console.error('Failed to create job:', error);
        // Optionally show an error message to the user
      }
    });
  }
}
