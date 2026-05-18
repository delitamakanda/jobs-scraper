import { inject, Injectable, signal } from '@angular/core';
import { ApplicationsApi } from '../api/applications.api';
import { Application } from '../../shared/models/application.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStore {
  private readonly api = inject(ApplicationsApi);

  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null)
  private _applications = signal<Application[]>([]);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly applications = this._applications.asReadonly();

  fetchApplications(): Observable<Application[]> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.getApplications().pipe(
      tap((applications: Application[]) => {
        console.log('Fetched applications:', applications);
        this._applications.set(applications);
        this._loading.set(false);
      })
    );
  }

  createApplication(data: Application): Observable<Application> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.createApplication(data).pipe(
      tap((application) => {
        console.log('Created application:', application);
        const currentApplications = this._applications();
        this._applications.set([...currentApplications, application]);
        this._loading.set(false);
      })
    );
  }

}
