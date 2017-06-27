import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from 'app/app.translation.module';
import { NgaModule } from 'app/theme/nga.module';

import { DashboardComponent } from './dashboard.component';
import { routing } from './dashboard.routing';

import { ActionsCardComponent } from './actions-card/actions-card.component';
import { FeedsCardComponent } from './feeds-card/feeds-card.component';
import { PieChart } from './pieChart';
import { TrafficChart } from './trafficChart';
import { FeedComponent } from './feed/feed.component';
import { FeedService } from './feed/feed.service';
import { PieChartService } from './pieChart/pieChart.service';
import { TrafficChartService } from './trafficChart/trafficChart.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing
  ],
  declarations: [
    ActionsCardComponent,
    FeedsCardComponent,
    PieChart,
    TrafficChart,
    FeedComponent,
    DashboardComponent
  ],
  providers: [
    FeedService,
    PieChartService,
    TrafficChartService,
  ]
})
export class DashboardModule { }
