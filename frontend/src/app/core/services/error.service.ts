import { Injectable, signal } from '@angular/core';
import { ErrorApiResponse } from '@app/core/models/api-error.model';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSignal = signal<ErrorApiResponse | null>(null);
  handleError(error: ErrorApiResponse): void {
    console.error('An error occurred:', error);
    this.errorSignal.set(error);
  }
}
