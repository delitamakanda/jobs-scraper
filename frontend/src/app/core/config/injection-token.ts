import { InjectionToken } from "@angular/core";
import { ApiConfig } from "./api.config";

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>('API_CONFIG');