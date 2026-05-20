import { Component, input, output } from '@angular/core';
import { ApplicationCardComponent } from '../card/application-card.component';
import { Application, ApplicationStatus } from '../../../../shared/models/application.model';

interface KanbanColumn {
  status: ApplicationStatus;
  title: string;
  description: string;
}

@Component({
  selector: 'app-application-kanban',
  imports: [ApplicationCardComponent],
  templateUrl: './application-kanban.component.html',
  styleUrls: ['./application-kanban.component.css'],
  standalone: true,
})
export class ApplicationKanbanComponent {

  applications = input.required<Application[]>();
  generateCoverLetter = output<Application>();
  generateInterviewPrep = output<Application>();

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
      status: 'INTERVIEW',
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
}
