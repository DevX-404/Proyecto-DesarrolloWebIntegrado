import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout').then(m => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'medicos',
        loadComponent: () => import('./features/medicos/medicos').then(m => m.MedicosComponent)
      },
      {
        path: 'pacientes',
        loadComponent: () => import('./features/pacientes/pacientes').then(m => m.PacientesComponent)
      },
      {
        path: 'citas',
        loadComponent: () => import('./features/citas/citas/citas').then(m => m.CitasComponent)
      },
    {
      path: 'mis-citas',
      loadComponent: () => import('./features/medico-citas/medico-citas').then(m => m.MedicoCitasComponent)
    }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];