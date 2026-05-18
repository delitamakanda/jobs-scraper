import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { JobsStore } from '../../../core/state/jobs.store';

@Component({
  selector: 'app-jobs-detail',
  imports: [
    AsyncPipe
  ],
  providers: [JobsStore],
  templateUrl: './jobs-detail.page.html',
  styleUrls: ['./jobs-detail.page.css'] ,
})
export class JobsDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(JobsStore);

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

    generateCoverLetter(id: number) {
      return this.store.generateCoverletter(id).subscribe({
        next: (result) => {
          console.log('Generated cover letter:', result);
        },
        error: (err) => {
          console.error('Error generating cover letter:', err);
        }
      });
    }

    generateInterviewPreparation(id: number) {
      return this.store.generateInterviewPreparation(id).subscribe({
        next: (result) => {
          console.log('Generated interview preparation:', result);
        },
        error: (err) => {
          console.error('Error generating interview preparation:', err);
        }
      });
    }

}
