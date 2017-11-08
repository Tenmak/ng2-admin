import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'maps', pathMatch: 'full' },
      { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
      { path: 'tables', loadChildren: './tables/tables.module#TablesModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
