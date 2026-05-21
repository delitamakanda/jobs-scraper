import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InterviewPrepDialogComponent } from '../dialogs/interview-prep/interview-prep-dialog.component';
import { CoverLetterDialogComponent } from '../dialogs/cover-letter/cover-letter-dialog.component';
import { Application } from '../../../shared/models/application.model';
import { ApplicationStore } from '../../../core/state/application.store';

@Injectable({
  providedIn: 'root',
})
export class DialogsService {
  readonly dialog  = inject(MatDialog);
  readonly store = inject(ApplicationStore);

  openCoverLetterDialog(application: Application): void {
    this.dialog.open(CoverLetterDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      height: '90vh',
      autoFocus: false,
      data: { application },
    });
  }

  openInterviewPrepDialog(application: Application): void {
    this.dialog.open(InterviewPrepDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      height: '90vh',
      autoFocus: false,
      data: { application },
    });
  }
}
