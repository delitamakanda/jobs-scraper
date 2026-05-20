import { Component, inject, OnInit } from '@angular/core';
import { ApplicationStore } from '../../core/state/application.store';
import { Application } from '../../shared/models/application.model';
import { ApplicationKanbanComponent } from './components/kanban/application-kanban.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-applications',
  imports: [
    ApplicationKanbanComponent,
    AsyncPipe
  ],
  providers: [
    ApplicationStore
  ],
  templateUrl: './applications.page.html',
  styleUrls: ['./applications.page.css'],
})
export class ApplicationsPage implements OnInit {
  readonly store = inject(ApplicationStore);
  protected applications$!: Observable<Application[]>;

  ngOnInit(): void {
    this.applications$ = this.store.fetchApplications();
  }

  generateCoverLetter(application: Application): void {
    this.store.generateCoverletter(application.job_offer.id, {
      tone: 'formal',
      format: 'linkedin',
      language: 'fr',
      max_length: 'medium',
    }).subscribe();
  }

  generateInterviewPrep(application: Application): void {
    this.store.generateInterviewPreparation(application.job_offer.id, {
      focus: ['angular_architecture', 'signals', 'testing', 'migration'],
      difficulty: 'mid',
    }).subscribe();
  }
}
