import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileStore } from '../../core/state/profile.store';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
  standalone: true,
})
export class ProfilePage {
  private readonly fb = inject(FormBuilder);
  private store = inject(ProfileStore);

  readonly form = this.fb.nonNullable.group({
    title: [''],
    summary: [''],
    years_of_experience: [0],
    seniority: [''],
    main_skills: [[] as string[]],
    secondary_skills: [[] as string[]],
    industries: [[] as string[]],
    projects: [[] as string[]],
    prefered_locations: [[] as string[]],
    remote_preference: [''],
    target_salary_min: [0],
    target_salary_max: [0],
    linkedin_url: [''],
    github_url: [''],
  });

  constructor() {
    this.store.loadProfile().subscribe((profile) => {
      this.form.patchValue(profile);
    });
  }

  save() {
    if (this.form.valid) {
      this.store.saveProfile(this.form.getRawValue()).subscribe();
    }
  }
}
