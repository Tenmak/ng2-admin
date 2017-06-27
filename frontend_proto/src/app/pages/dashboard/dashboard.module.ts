import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from 'app/theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from './dashboard.component';
import { routing } from './dashboard.routing';

import { ActionsCardComponent } from './actions-card/actions-card.component';
import { FeedsCardComponent } from './feeds-card/feeds-card.component';
import { TrafficChartComponent } from './trafficChart/trafficChart.component';
import { FeedComponent } from './feed/feed.component';
import { FeedService } from './feed/feed.service';
import { TrafficChartService } from './trafficChart/trafficChart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    NgbModule.forRoot(),
  ],
  declarations: [
    ActionsCardComponent,
    FeedsCardComponent,
    TrafficChartComponent,
    FeedComponent,
    DashboardComponent
  ],
  providers: [
    FeedService,
    TrafficChartService,
  ]
})
export class DashboardModule { }
