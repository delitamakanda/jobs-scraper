import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-jobs-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './jobs-create.page.html',
  styleUrl: './jobs-create.page.css',
})
export class JobsCreatePage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

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
    
    console.log('Form submitted:', this.form.value);
    // Save the job to the API and navigate to the job details page.
    this.router.navigate(['/jobs', '1']);
  }
}
