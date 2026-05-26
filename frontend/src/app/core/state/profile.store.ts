import { inject, Injectable, signal } from '@angular/core';
import { ProfileApi } from '../api/profile.api';
import { Profile } from '../../shared/models/profile.model';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly api = inject(ProfileApi);

  private _profile = signal<Profile | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _saved = signal<boolean>(false);


  readonly profile = this._profile.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly saved = this._saved.asReadonly();

  loadProfile(): Observable<Profile> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.getProfile().pipe(
      tap((profile: Profile) => {
        this._profile.set(profile);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return throwError(() => error);
      })
    );
  }

  saveProfile(profile: Partial<Profile>): Observable<Partial<Profile>> {
    this._loading.set(true);
    this._error.set(null);
    return this.api.updateProfile(profile).pipe(
      tap(() => {
        this._saved.set(true);
        this._loading.set(false);
      }),
      catchError((error) => {
        this._error.set(error.message);
        this._loading.set(false);
        return throwError(() => error);
      })
    );
  }

}
