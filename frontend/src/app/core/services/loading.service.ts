import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading = signal(false);
  private _count = signal(0);

  readonly count = this._count.asReadonly();
  readonly loading = this._loading.asReadonly();

  setLoading(loading: boolean) {
    this._loading.set(loading);
    this._count.set(loading ? this._count() + 1 : this._count() - 1);
  }
}
