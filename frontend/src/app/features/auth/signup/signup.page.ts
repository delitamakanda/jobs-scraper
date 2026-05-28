import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../core/state/auth.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../shared/ui/material.imports';
import { RegisterUser } from '../../../shared/models/auth.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ...MATERIAL_IMPORTS,
  ],
  providers: [
    AuthStore,
  ],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.css'],
})
export class SignupPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly store = inject(AuthStore);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]],
    first_name: [''],
    last_name: [''],
  });

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { ...signupData } = this.form.value;

    if (signupData.password !== signupData.password2) {
      // Handle password mismatch error (e.g., show a message to the user)
      console.error('Passwords do not match');
      return;
    }

    this.store.signup(signupData as RegisterUser).subscribe({
      next: () => {
        console.log('Signup successful:', signupData);
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        // Optionally show error message to the user
      }
    });
  }
}
