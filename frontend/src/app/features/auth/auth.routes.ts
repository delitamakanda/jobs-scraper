import { Routes } from "@angular/router";

export const  AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'signup',
        loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];