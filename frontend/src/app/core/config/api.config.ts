import {environment } from '../../../environments/environment';

export interface ApiConfig {
    baseApiUrl: string;
}

export const API_CONFIG: ApiConfig = {
    baseApiUrl: environment.apiUrl,
};