import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EsriLoaderModule, EsriLoaderService } from 'angular-esri-loader';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './maps.routing';
import { MapsComponent } from './maps.component';
import { EsriMapComponent } from './esriMaps/esriMap.component';

import { EsriMapResolveService } from './esriMaps/esriMap.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EsriLoaderModule,
    NgaModule,
    routing
  ],
  declarations: [
    MapsComponent,
    EsriMapComponent
  ],
  providers: [
    EsriMapResolveService,
    EsriLoaderService
  ]
})
export class MapsModule { }
