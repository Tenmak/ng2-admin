import { Component, ElementRef, AfterViewInit } from '@angular/core';

import 'leaflet-map';
import 'esri-leaflet';

declare let require: any;
const esri_leaflet = require('esri-leaflet');

@Component({
  selector: 'reflex-leaflet-map',
  templateUrl: './leafletMap.component.html',
  styleUrls: ['./leafletMap.component.scss']
})
export class LeafletMapComponent implements AfterViewInit {

  constructor(private _elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    const el = this._elementRef.nativeElement.querySelector('.leaflet-maps');

    L.Icon.Default.imagePath = 'assets/img/theme/vendor/leaflet';

    const map = L.map(el).setView([48.858435, 2.341483], 13);
    // Set the Esri link with the library
    L.esri = esri_leaflet;

    L.esri.basemapLayer('DarkGray').addTo(map);

    const layer = L.esri.dynamicMapLayer({
      url: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/MapServer'
    }).addTo(map);

    const popupTemplate = '<h3>{OBJECTID}</h3>ID_VERSION_GEOM:{ID_VERSION_GEOM}<br><small>STATUT_GEOM: {STATUT_GEOM}<small>';

    layer.bindPopup(function (error, featureCollection) {
      if (error || featureCollection.features.length === 0) {
        return false;
      } else {
        return L.Util.template(popupTemplate, featureCollection.features[0].properties)
      }
    });
  }
}
