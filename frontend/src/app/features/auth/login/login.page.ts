import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/state/auth.store';
import { MATERIAL_IMPORTS } from '../../../shared/ui/material.imports';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ...MATERIAL_IMPORTS,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  
  readonly store = inject(AuthStore);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      return;
    }

    const username = this.form.value.username!;
    const password = this.form.value.password!;
    
    this.store.login(username, password).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 0);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
