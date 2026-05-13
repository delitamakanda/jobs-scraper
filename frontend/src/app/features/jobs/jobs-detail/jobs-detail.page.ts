import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { JobsState } from '../../../core/state/jobs.state';

@Component({
  selector: 'app-jobs-detail',
  imports: [
    AsyncPipe
  ],
  providers: [JobsState],
  templateUrl: './jobs-detail.page.html',
  styleUrl: './jobs-detail.page.css',
})
export class JobsDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(JobsState);

  readonly job$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (id) {
        return this.store.getJob(Number(id));
      }
      return of(null);
    })
  );

    analyze(id: number) {
      // Implement the logic to analyze the job description and generate a summary
      console.log(`Analyzing job with ID: ${id}`);
      return this.store.analyzeJob(id).subscribe({
        next: (result) => {
          console.log('Analysis result:', result);
        },
        error: (err) => {
          console.error('Error analyzing job:', err);
        }
      });
    }

    match(id: number) {
      // Implement the logic to match the job description with the user's profile and generate a match score
      console.log(`Matching job with ID: ${id}`);
      return this.store.matchJob(id).subscribe({
        next: (result) => {
          console.log('Match result:', result);
        },
        error: (err) => {
          console.error('Error matching job:', err);
        }
      });
    }

}
