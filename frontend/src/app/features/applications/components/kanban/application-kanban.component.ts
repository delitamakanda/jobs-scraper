import { Component, input, output } from '@angular/core';
import { ApplicationCardComponent } from '../card/application-card.component';
import { Application, ApplicationStatus } from '../../../../shared/models/application.model';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface KanbanColumn {
  status: ApplicationStatus;
  title: string;
  description: string;
}

@Component({
  selector: 'app-application-kanban',
  imports: [ApplicationCardComponent, DragDropModule],
  templateUrl: './application-kanban.component.html',
  styleUrls: ['./application-kanban.component.css'],
  standalone: true,
})
export class ApplicationKanbanComponent {

  applications = input.required<Application[]>();
  generateCoverLetter = output<Application>();
  generateInterviewPrep = output<Application>();
  statusChanged = output<{ application: Application, newStatus: ApplicationStatus }>();

  readonly columns: KanbanColumn[] = [
    {
      status: 'SAVED',
      title: 'Saved',
      description: 'A étudier',
    },
    {
      status: 'APPLIED',
      title: 'Applied',
      description: 'Candidature envoyée',
    },
    {
      status: 'INTERVIEWED',
      title: 'Interview',
      description: 'Entretien programmé',
    },
    {
      status: 'OFFER',
      title: 'Offer',
      description: 'Offre reçue',
    },
    {
      status: 'REJECTED',
      title: 'Rejected',
      description: 'Candidature rejetée',
    },
  ];

  getApplicationsByStatus(status: ApplicationStatus): Application[] {
    return this.applications().filter(application => application.status === status);
  }

  drop(event: CdkDragDrop<Application[]>, status: ApplicationStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const application = event.previousContainer.data[event.previousIndex];
      
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      const updatedApplication = {...application, status };
      this.statusChanged.emit({ application: updatedApplication, newStatus: status });
    }
  }

  getConnectedLists(): string[] {
    return this.columns.map(column => `list-${column.status}`);
  }
}
