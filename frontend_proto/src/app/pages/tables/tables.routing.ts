import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';

export const routes: Routes = [
  {
    path: '',
    component: TablesComponent,
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
