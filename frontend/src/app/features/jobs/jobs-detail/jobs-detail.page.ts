import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-jobs-detail',
  imports: [
    AsyncPipe
  ],
  templateUrl: './jobs-detail.page.html',
  styleUrl: './jobs-detail.page.css',
})
export class JobsDetailPage {
  private readonly route = inject(ActivatedRoute);

  readonly job$ = this.route.paramMap.pipe(
    switchMap(params => of({
      id: Number('1'),
      title: 'Software Engineer',
      company: 'Tech Company',
      location: 'New York, NY',
      salary: '$100,000 - $120,000',
      description: 'We are looking for a skilled software engineer to join our team.',
      seniority: 'Mid-level',
      ai_summary: 'We have a strong AI team and a focus on cutting-edge technologies.',
      raw_description: 'We are looking for a skilled software engineer to join our team. The ideal candidate will have experience with Angular, TypeScript, and RxJS. You will be responsible for developing and maintaining our web applications, collaborating with cross-functional teams, and contributing to the overall success of our projects.',
      required_skills: ['Angular', 'TypeScript', 'RxJS'],
      nice_to_have_skills: ['Docker', 'Kubernetes'],
    }))
  );

    analyze(id: number) {
      // Implement the logic to analyze the job description and generate a summary
      console.log(`Analyzing job with ID: ${id}`);
    }

    match(id: number) {
      // Implement the logic to match the job description with the user's profile and generate a match score
      console.log(`Matching job with ID: ${id}`);
    }

}
