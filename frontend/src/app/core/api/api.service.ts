import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG_TOKEN } from '../config/injection-token';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG_TOKEN);

  get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ) : Observable<T> {
    return this.http.get<T>(`${this.config.baseApiUrl}/${endpoint}`, { params });
  }

  post<T>(
    endpoint: string,
    data: any,
  ) : Observable<T> {
    return this.http.post<T>(`${this.config.baseApiUrl}/${endpoint}`, data);
  }

  put<T>(
    endpoint: string,
    data: any,
  ) : Observable<T> {
    return this.http.put<T>(`${this.config.baseApiUrl}/${endpoint}`, data);
  }

  patch<T>(
    endpoint: string,
    data: any,
  ) : Observable<T> {
    return this.http.patch<T>(`${this.config.baseApiUrl}/${endpoint}`, data);
  }

  delete<T>(
    endpoint: string,
  ) : Observable<T> {
    return this.http.delete<T>(`${this.config.baseApiUrl}/${endpoint}`);
  }

}
