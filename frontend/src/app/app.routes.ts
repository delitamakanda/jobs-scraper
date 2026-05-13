import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { ShellComponent } from './core/layout/shell/shell.component';


export const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
            },
            {
                path: 'jobs',
                loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.JOBS_ROUTES)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage)
            },
            {
                path: 'applications',
                loadComponent: () => import('./features/applications/applications.page').then(m => m.ApplicationsPage)
            }
        ],
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
