import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path:'login', loadComponent:()=>import('./features/auth/login.component').then(m=>m.LoginComponent) },
  { path:'app', canActivate:[authGuard], loadComponent:()=>import('./shared/layout/app-shell.component').then(m=>m.AppShellComponent), children:[
    { path:'overview', loadComponent:()=>import('./features/overview/overview.component').then(m=>m.OverviewComponent) },
    { path:'projects', loadComponent:()=>import('./features/projects/projects.component').then(m=>m.ProjectsComponent) },
    { path:'projects/:id', loadComponent:()=>import('./features/projects/project-detail.component').then(m=>m.ProjectDetailComponent) },
    { path:'customers', loadComponent:()=>import('./features/customers/customers.component').then(m=>m.CustomersComponent) },
    { path:'customers/:id', loadComponent:()=>import('./features/customers/customer-detail.component').then(m=>m.CustomerDetailComponent) },
    { path:'inventory', loadComponent:()=>import('./features/inventory/inventory.component').then(m=>m.InventoryComponent) },
    { path:'tasks', loadComponent:()=>import('./features/tasks/tasks.component').then(m=>m.TasksComponent) },
    { path:'notifications', loadComponent:()=>import('./features/notifications/notifications.component').then(m=>m.NotificationsComponent) },
    { path:'settings', loadComponent:()=>import('./features/settings/settings.component').then(m=>m.SettingsComponent) },
    { path:'profile', loadComponent:()=>import('./features/profile/profile.component').then(m=>m.ProfileComponent) },
    { path:'search', loadComponent:()=>import('./features/not-found/search.component').then(m=>m.SearchComponent) },
    { path:'', pathMatch:'full', redirectTo:'overview' }
  ]},
  { path:'', pathMatch:'full', redirectTo:'app/overview' },
  { path:'**', loadComponent:()=>import('./features/not-found/not-found.component').then(m=>m.NotFoundComponent) }
];
