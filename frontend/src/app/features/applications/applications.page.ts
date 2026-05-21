import { Component, inject, OnInit } from '@angular/core';
import { ApplicationStore } from '../../core/state/application.store';
import { Application } from '../../shared/models/application.model';
import { ApplicationKanbanComponent } from './components/kanban/application-kanban.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DialogsService } from './services/dialogs.service';

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
  readonly dialog = inject(DialogsService);
  protected applications$!: Observable<Application[]>;

  ngOnInit(): void {
    this.applications$ = this.store.fetchApplications();
  }

  generateCoverLetter(application: Application): void {
    this.dialog.openCoverLetterDialog(application);
  }

  generateInterviewPrep(application: Application): void {
    this.dialog.openInterviewPrepDialog(application);
  }
}
