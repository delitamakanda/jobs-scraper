import { Injectable, signal } from '@angular/core';

interface ErrorApiResponse {
  message: string;
  status: number;
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSignal = signal<ErrorApiResponse | null>(null);
  handleError(error: ErrorApiResponse): void {
    // Implement your error handling logic here
    console.error('An error occurred:', error);
    this.errorSignal.set(error);
  }
}
