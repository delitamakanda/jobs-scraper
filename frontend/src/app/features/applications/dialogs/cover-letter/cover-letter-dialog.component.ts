import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ApplicationStore } from '../../../../core/state/application.store';
import { Application } from '../../../../shared/models/application.model';
import { form, required, minLength, submit } from '@angular/forms/signals';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cover-letter-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  providers: [
    ApplicationStore,
  ],
  standalone: true,
  templateUrl: './cover-letter-dialog.component.html',
  styleUrls: ['./cover-letter-dialog.component.css'],
})
export class CoverLetterDialogComponent {
  readonly store = inject(ApplicationStore);
  readonly data = inject(MAT_DIALOG_DATA) as { application: Application };

  readonly form = new FormGroup({
    tone: new FormControl<'formal' | 'informal' | 'friendly'>('formal', { 
      nonNullable: true,
      validators: [Validators.required] 
    }),
    format: new FormControl<'linkedin' | 'email' | 'short_letter'>('linkedin', { 
      nonNullable: true,
      validators: [Validators.required] 
    }),
    language: new FormControl<'fr' | 'en' | 'es'>('fr', { 
      nonNullable: true,
      validators: [Validators.required] 
    }),
    max_length: new FormControl<'short' | 'medium' | 'long'>('medium', { 
      nonNullable: true,
      validators: [Validators.required] 
    }),
  });

  copyCoverLetter(): void {
    navigator.clipboard.writeText(this.store.content());
  }

  generateCoverLetter(event: Event): void {
    event.preventDefault();
    if (!this.form.valid) {
      return;
    }
    const formValue = this.form.getRawValue();
    this.store.generateCoverletter(this.data.application.job_offer.id, {
      tone: formValue.tone,
      format: formValue.format,
      language: formValue.language,
      max_length: formValue.max_length,
    }).subscribe({
      next: () => {
        console.log('Cover letter generated successfully');
      },
      error: (err) => {
        console.error('Error generating cover letter:', err);
      }
    });
  }
}
