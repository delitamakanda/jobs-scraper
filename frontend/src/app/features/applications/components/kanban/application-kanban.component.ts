import {
  afterNextRender,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import { ApplicationCardComponent } from '../card/application-card.component';
import { Application, ApplicationStatus } from '../../../../shared/models/application.model';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

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
  statusChanged = output<{ application: Application; newStatus: ApplicationStatus }>();

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

  readonly announcement = signal('');

  private readonly injector = inject(Injector);
  private pendingFocusId: number | null = null;

  constructor() {
    // The status <select> is recreated in its new column once the store updates:
    // give keyboard users their focus back on it.
    effect(() => {
      this.applications();
      const id = this.pendingFocusId;
      if (id === null) {
        return;
      }
      this.pendingFocusId = null;
      afterNextRender(() => document.getElementById(`status-${id}`)?.focus(), {
        injector: this.injector,
      });
    });
  }

  getApplicationsByStatus(status: ApplicationStatus): Application[] {
    return this.applications().filter((application) => application.status === status);
  }

  countLabel(count: number): string {
    return `${count} ${count > 1 ? 'candidatures' : 'candidature'}`;
  }

  onStatusSelect(application: Application, value: string): void {
    const status = value as ApplicationStatus;
    if (status === application.status) {
      return;
    }
    this.pendingFocusId = application.id;
    this.announceMove(application, status);
    this.statusChanged.emit({ application: { ...application, status }, newStatus: status });
  }

  private announceMove(application: Application, status: ApplicationStatus): void {
    const title = this.columns.find((column) => column.status === status)?.title ?? status;
    this.announcement.set(`Candidature ${application.job_offer.title} déplacée vers ${title}`);
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
        event.currentIndex,
      );

      this.announceMove(application, status);
      const updatedApplication = { ...application, status };
      this.statusChanged.emit({ application: updatedApplication, newStatus: status });
    }
  }

  getConnectedLists(): string[] {
    return this.columns.map((column) => `list-${column.status}`);
  }
}
