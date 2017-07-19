import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from 'app/theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { routing } from './tables.routing';

import { TablesComponent } from './tables.component';
import { ProfileComponent } from './profiles/profiles.component';

import { ProfileService } from './profiles/profiles.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    Ng2SmartTableModule,
    routing,
    NgbModule.forRoot(),
  ],
  declarations: [
    TablesComponent,
    ProfileComponent
  ],
  providers: [
    ProfileService
  ]
})
export class TablesModule { }
