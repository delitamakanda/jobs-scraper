import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ApplicationStore } from '../../../../core/state/application.store';

@Component({
  selector: 'app-cover-letter-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    ApplicationStore,
  ],
  standalone: true,
  templateUrl: './cover-letter-dialog.component.html',
  styleUrls: ['./cover-letter-dialog.component.css'],
})
export class CoverLetterDialogComponent {
  readonly store = inject(ApplicationStore);

  copyCoverLetter(): void {
    navigator.clipboard.writeText(this.store.content());
  }
}
