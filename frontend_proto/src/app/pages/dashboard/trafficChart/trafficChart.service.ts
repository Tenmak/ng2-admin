import { Injectable } from '@angular/core';
import { BaThemeConfigProvider, ColorHelper } from '../../../theme';

@Injectable()
export class TrafficChartService {

  constructor(private _baConfig: BaThemeConfigProvider) {
  }

  getData() {
    const dashboardColors = this._baConfig.get().colors.dashboard;

    const totalChartItems = 103168;

    return [
      {
        value: 4,
        color: dashboardColors.white,
        highlight: ColorHelper.shade(dashboardColors.white, 15),
        label: 'Groupe de Lieu',
        percentage: Number(Math.round(4 / totalChartItems * 100 * 100) / 100).toFixed(2),
        order: 0,
      }, {
        value: 15431,
        color: dashboardColors.gossip,
        highlight: ColorHelper.shade(dashboardColors.gossip, 15),
        label: 'Lieu d\'Arrêt',
        percentage: Number(Math.round(15431 / totalChartItems * 100 * 100) / 100).toFixed(2),
        order: 3,
      }, {
        value: 17465,
        color: dashboardColors.silverTree,
        highlight: ColorHelper.shade(dashboardColors.silverTree, 15),
        label: 'Zone de Lieu',
        percentage: Number(Math.round(17465 / totalChartItems * 100 * 100) / 100).toFixed(2),
        order: 2,
      }, {
        value: 41139,
        color: dashboardColors.surfieGreen,
        highlight: ColorHelper.shade(dashboardColors.surfieGreen, 15),
        label: 'Zone d\'embarquement',
        percentage: Number(Math.round(41139 / totalChartItems * 100 * 100) / 100).toFixed(2),
        order: 1,
      }, {
        value: 2129,
        color: dashboardColors.blueStone,
        highlight: ColorHelper.shade(dashboardColors.blueStone, 15),
        label: 'Accès de Lieu',
        percentage: Number(Math.round(2129 / totalChartItems * 100 * 100) / 100).toFixed(2),
        order: 4,
      },
    ];
  }
}
