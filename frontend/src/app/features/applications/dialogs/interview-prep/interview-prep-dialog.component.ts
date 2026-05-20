import { Component, inject } from '@angular/core';
import { ApplicationStore } from '../../../../core/state/application.store';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-interview-prep-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
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

  copyInterviewPrep(): void {
    navigator.clipboard.writeText(this.store.content());
  }
}
