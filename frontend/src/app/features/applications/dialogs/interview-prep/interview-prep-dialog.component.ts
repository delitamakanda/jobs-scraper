import { Component, inject, signal } from '@angular/core';
import { ApplicationStore } from '../../../../core/state/application.store';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Application } from '../../../../shared/models/application.model';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { form, required, submit } from '@angular/forms/signals';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-interview-prep-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [
    ApplicationStore,
  ],
  standalone: true,
  templateUrl: './interview-prep-dialog.component.html',
  styleUrls: ['./interview-prep-dialog.component.css']  ,
})
export class InterviewPrepDialogComponent {
  readonly store = inject(ApplicationStore);
  readonly data = inject(MAT_DIALOG_DATA) as { application: Application };

  readonly form = new FormGroup({
    focus: new FormControl<string[]> ([], { 
      nonNullable: true,
      validators: [Validators.required]
    }),
    difficulty: new FormControl<'senior' | 'mid' | 'expert'>('mid', { 
      nonNullable: true,
      validators: [Validators.required]
    }),
    language: new FormControl<'fr' | 'en' | 'es'>('fr', { 
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  copyInterviewPrep(): void {
    navigator.clipboard.writeText(
      `Questions:\n${this.store.questions().join('\n')}\n\n` +
      `Mock Answers:\n${this.store.mockAnswers().join('\n')}\n\n` +
      `Recommended Topics:\n${this.store.recommendedTopics().join('\n')}\n\n` +
      `Weak Points:\n${this.store.weakPoints().join('\n')}`
    );
  }

  generateInterviewPrep(event: Event): void {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    // ex: angular_architecture,signals,testing,migration
    const formValue = this.form.getRawValue();
    let focusArray: string[] = [];
    if (typeof formValue.focus ==='string') {
      focusArray = [formValue.focus];
    } else if (Array.isArray(formValue.focus)) {
      focusArray = formValue.focus;
    }
    focusArray = focusArray.map((focus) => focus.trim());
    this.store.generateInterviewPreparation(this.data.application.job_offer.id, {...formValue, focus: focusArray}).subscribe({
      next: () => {
        console.log('Generated interview preparation:', this.store.content());
      },
      error: (err) => {
        console.error('Error generating interview preparation:', err);
      }
    });
   }
}
