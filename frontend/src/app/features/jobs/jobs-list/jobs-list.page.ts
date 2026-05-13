import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-jobs-list',
  imports: [
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './jobs-list.page.html',
  styleUrl: './jobs-list.page.css',
})
export class JobsListPage {

  readonly jobs$ = of([
    {
      id: '1',
      title: 'Software Engineer',
      company: 'Tech Company',
      location: 'New York, NY',
      salary: '$100,000 - $120,000',
      description: 'We are looking for a skilled software engineer to join our team.',
      seniority: 'Mid-level',
      ai_summary: 'We have a strong AI team and a focus on cutting-edge technologies.',
      raw_description: 'We are looking for a skilled software engineer to join our team. The ideal candidate will have experience with Angular, TypeScript, and RxJS. You will be responsible for developing and maintaining our web applications, collaborating with cross-functional teams, and contributing to the overall success of our projects.',
      
    }
  ]);
}
