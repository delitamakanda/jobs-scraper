import { Component, inject, OnInit } from '@angular/core';
import { ApplicationStore } from '../../core/state/application.store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Application } from '../../shared/models/application.model';

@Component({
  selector: 'app-applications',
  imports: [
    AsyncPipe
  ],
  providers: [
    ApplicationStore
  ],
  templateUrl: './applications.page.html',
  styleUrls: ['./applications.page.css'],
})
export class ApplicationsPage implements OnInit {
  private readonly store = inject(ApplicationStore);

  protected applications$!: Observable<Application[]>;

  ngOnInit(): void {
    this.applications$ = this.store.fetchApplications();
  }
}
