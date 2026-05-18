import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileApi } from '../../core/api/profile.api';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
})
export class ProfilePage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProfileApi);

  readonly form = this.fb.nonNullable.group({
    title: [''],
    summary: [''],
  });

  constructor() {
    this.api.getProfile().subscribe((profile) => {
      this.form.patchValue(profile);
    });
  }

  save() {
    if (this.form.valid) {
      this.api.updateProfile(this.form.getRawValue()).subscribe();
    }
  }
}
