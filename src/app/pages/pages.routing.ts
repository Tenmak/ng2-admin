import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'tables', pathMatch: 'full' },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
