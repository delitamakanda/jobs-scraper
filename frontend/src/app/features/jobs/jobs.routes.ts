import { Routes } from "@angular/router";

export const JOBS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./jobs-list/jobs-list.page').then(m => m.JobsListPage)
    },
    {
        path: ':id',
        loadComponent: () => import('./jobs-detail/jobs-detail.page').then(m => m.JobsDetailPage)
    },
    {
        path: 'new',
        loadComponent: () => import('./jobs-create/jobs-create.page').then(m => m.JobsCreatePage)
    },
];