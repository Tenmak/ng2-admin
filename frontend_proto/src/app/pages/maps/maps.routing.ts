import { Routes, RouterModule } from '@angular/router';

import { MapsComponent } from './maps.component';
import { EsriMapComponent } from './esriMaps/esriMap.component';
import { EsriMapResolveService } from './esriMaps/esriMap.service';

const routes: Routes = [
  {
    path: '',
    component: MapsComponent,
    children: [
      {
        path: 'esrimaps', component: EsriMapComponent,
        resolve: {
          esriModules: EsriMapResolveService
        }
      },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
