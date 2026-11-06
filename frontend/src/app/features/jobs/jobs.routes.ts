import { Routes } from '@angular/router';

export const JOBS_ROUTES: Routes = [
  {
    path: '',
    title: 'Offres – Happiness AI',
    loadComponent: () => import('./jobs-list/jobs-list.page').then((m) => m.JobsListPage),
  },
  {
    path: 'new',
    title: 'Ajouter une offre – Happiness AI',
    loadComponent: () => import('./jobs-create/jobs-create.page').then((m) => m.JobsCreatePage),
  },
  {
    path: ':id',
    title: "Détail de l'offre – Happiness AI",
    loadComponent: () => import('./jobs-detail/jobs-detail.page').then((m) => m.JobsDetailPage),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
