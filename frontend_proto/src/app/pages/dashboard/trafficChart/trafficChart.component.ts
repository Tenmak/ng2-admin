import { Component, AfterViewInit } from '@angular/core';

import { TrafficChartService } from './trafficChart.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'reflex-traffic-chart',
  templateUrl: './trafficChart.component.html',
  styleUrls: ['./trafficChart.component.scss']
})

// TODO: move chart.js to it's own component
export class TrafficChartComponent implements AfterViewInit {
  doughnutData: Array<Object>;

  constructor(private trafficChartService: TrafficChartService) {
    this.doughnutData = trafficChartService.getData();
  }

  ngAfterViewInit() {
    this._loadDoughnutCharts();
  }

  private _loadDoughnutCharts() {
    const el = jQuery('.chart-area').get(0) as HTMLCanvasElement;
    new Chart(el.getContext('2d')).Doughnut(this.doughnutData, {
      segmentShowStroke: false,
      percentageInnerCutout: 64,
      responsive: true
    });
  }
}
