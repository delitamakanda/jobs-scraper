import { Component, inject, OnInit } from '@angular/core';
import { ApplicationStore } from '../../core/state/application.store';
import { Application } from '../../shared/models/application.model';
import { ApplicationKanbanComponent } from './components/kanban/application-kanban.component';
import { DialogsService } from './services/dialogs.service';

@Component({
  selector: 'app-applications',
  imports: [
    ApplicationKanbanComponent,
  ],
  providers: [
    ApplicationStore
  ],
  templateUrl: './applications.page.html',
  styleUrls: ['./applications.page.css'],
})
export class ApplicationsPage implements OnInit {
  readonly store = inject(ApplicationStore);
  readonly dialog = inject(DialogsService);

  ngOnInit(): void {
    this.store.fetchApplications();
  }

  generateCoverLetter(application: Application): void {
    this.dialog.openCoverLetterDialog(application);
  }

  generateInterviewPrep(application: Application): void {
    this.dialog.openInterviewPrepDialog(application);
  }

  onStatusChanged(event: { application: Application, newStatus: string }): void {
    this.store.updateApplicationStatus(event.application.id, event.newStatus as Application['status']).subscribe({
      next: (updatedApplication) => {
        console.log('Application status updated successfully:', updatedApplication);
      },
      error: (error) => {
        console.error('Error updating application status:', error);
      }
    });
  }
}
