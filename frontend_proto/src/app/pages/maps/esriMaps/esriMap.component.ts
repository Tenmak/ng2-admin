import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EsriLoaderService } from 'angular-esri-loader';

@Component({
  selector: 'reflex-esri-map',
  templateUrl: './esriMap.component.html',
  styleUrls: ['./esriMap.component.scss']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;
  map: any;
  layerURL = 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/MapServer';

  constructor(
    private route: ActivatedRoute,
    private esriLoader: EsriLoaderService
  ) { }

  ngOnInit() {
    if (this.map) {
      // map is already initialized
      return;
    }

    // Get the required esri classes from the route
    const esriModules = this.route.snapshot.data['esriModules'];
    this.createMap(esriModules);

    this.loadStopsLayer();
  }

  // Create a map at the root dom node of this component
  createMap([Map]) {
    this.map = new Map(this.mapEl.nativeElement, {
      center: [2.341483, 48.858435],
      zoom: 16,
      basemap: 'dark-gray'
    });
  }

  // Loads the ArcGISDynamicMapServiceLayer and injects data from this service
  loadStopsLayer() {
    this.esriLoader.loadModules(['esri/layers/ArcGISDynamicMapServiceLayer'])
      .then(([ArcGISDynamicMapServiceLayer]) => {
        const stopsLayer = new ArcGISDynamicMapServiceLayer(this.layerURL);

        this.map.addLayer(stopsLayer);
        this.configureLayerInteractions();
      });
  }

  // Sets the behavior when the user interacts with the layer
  configureLayerInteractions() {
    this.esriLoader.loadModules([
      'esri/InfoTemplate',
      'esri/tasks/IdentifyTask',
      'esri/tasks/IdentifyParameters',
      'dojo/_base/array'
    ])
      .then(([
        InfoTemplate,
        IdentifyTask,
        IdentifyParameters,
        arrayUtils
      ]) => {
        // Popup test
        // const popup = new Popup('toto');

        // create identify tasks and setup parameters
        const identifyTask = new IdentifyTask(this.layerURL);

        const identifyParams = new IdentifyParameters();
        identifyParams.tolerance = 3;
        identifyParams.returnGeometry = true;
        identifyParams.layerIds = [0, 2];
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.width = this.map.width;
        identifyParams.height = this.map.height;

        // Manage click event
        this.map.on('click', (event) => {
          identifyParams.geometry = event.mapPoint;
          identifyParams.mapExtent = this.map.extent;

          const deferred = identifyTask
            .execute(identifyParams)
            .addCallback(function (response) {
              // response is an array of identify result objects
              // Let's return an array of features.
              return arrayUtils.map(response, function (result) {
                const feature = result.feature;
                const layerName = result.layerName;

                feature.attributes.layerName = layerName;
                const infoTemplateTest = new InfoTemplate('', 'toto');
                feature.setInfoTemplate(infoTemplateTest);

                return feature;
              });
            });

          // InfoWindow expects an array of features from each deferred
          // object that you pass. If the response from the task execution
          // above is not an array of features, then you need to add a callback
          // like the one above to post-process the response and return an
          // array of features.
          this.map.infoWindow.setFeatures([deferred]);
          this.map.infoWindow.show(event.mapPoint);
        });
      });
  }
}
