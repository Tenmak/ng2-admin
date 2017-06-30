import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EsriLoaderService } from 'angular-esri-loader';

import { MapParameters, FeatureLayerConfiguration } from './esriMap.interface';

@Component({
  selector: 'reflex-esri-map',
  templateUrl: './esriMap.component.html',
  styleUrls: ['./esriMap.component.scss']
})
export class EsriMapComponent implements OnInit {
  @ViewChild('map') mapEl: ElementRef;
  map: any;
  imageLayerURL = 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/MapServer';
  vectorsLayerBaseURL = 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/FeatureServer/';
  loadedFeatureLayers: any[] = [];
  geometryService = null;
  geometryServiceURL = 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/Utilities/Geometry/GeometryServer';
  drawToolbar: any = null;

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

    // Map parameters
    const mapParameters = {
      center: [2.341483, 48.858435],
      zoom: 17,
      basemap: 'dark-gray'
    };
    // Feature layers parameters
    const editableFeatureLayers = [0, 2, 4];
    // The order of the layers loaded matters for the edition !
    const featureLayersConfiguration: FeatureLayerConfiguration[] = [
      // { id: 17 },
      // { id: 13 },
      // { id: 15 },
      { id: 0, options: { outFields: ['*'] } },
      // { id: 2, options: { outFields: ['*'] } },
      // { id: 4, options: { outFields: ['*'] } },
    ]

    this.createMap(esriModules, mapParameters);
    this.initGeometryService();
    this.initDrawToolbar();
    // this.loadImageLayer();
    this.loadFeatureLayers(featureLayersConfiguration);
    this.setLayersEditable(editableFeatureLayers);
    this.initBufferMassSelection(editableFeatureLayers);
  }

  // Create a map at the root dom node of this component
  createMap([Map], mapParameters: MapParameters) {
    this.map = new Map(this.mapEl.nativeElement, mapParameters);
  }

  initGeometryService() {
    this.esriLoader.loadModules([
      'esri/tasks/GeometryService'
    ])
      .then(([
        GeometryService
      ]) => {
        this.geometryService = new GeometryService(this.geometryServiceURL);
      });
  }

  // Initialize the draw edition
  initDrawToolbar() {
    this.esriLoader.loadModules([
      'esri/toolbars/draw'
    ])
      .then(([
        Draw
      ]) => {
        this.drawToolbar = new Draw(this.map);
      });
  }

  // Loads the ArcGISDynamicMapServiceLayer and injects data from this service
  loadImageLayer() {
    this.esriLoader.loadModules(['esri/layers/ArcGISDynamicMapServiceLayer'])
      .then(([ArcGISDynamicMapServiceLayer]) => {
        const dynamicLayer = new ArcGISDynamicMapServiceLayer(this.imageLayerURL);

        this.map.addLayer(dynamicLayer);
        // this.configureLayerInteractions(this.imageLayerURL);
      });
  }

  // Sets the behavior when the user interacts with the layer
  configureLayerInteractions(layerURL: string) {
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
        const identifyTask = new IdentifyTask(layerURL);

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
                const infoTemplateTest = new InfoTemplate('', 'test');
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

  // Load the physical points from the feature layers
  loadFeatureLayers(layersConfiguration: FeatureLayerConfiguration[]) {
    this.esriLoader.loadModules(['esri/layers/FeatureLayer'])
      .then(([FeatureLayer]) => {
        // Create the corresponding FeatureLayers
        const featureLayersToLoad = [];
        layersConfiguration.forEach(layerConf => {
          featureLayersToLoad.push(new FeatureLayer(this.vectorsLayerBaseURL + layerConf.id, layerConf.options));
        });
        // Add them to the map
        this.map.addLayers(featureLayersToLoad);
        this.loadedFeatureLayers = featureLayersToLoad;
        console.log('Feature layers loaded => ', featureLayersToLoad.length);
      });
  }

  /**
   * Set the wanted feature layers editable
   * @param layerIds IDs of layers to set editable
   */
  setLayersEditable(layerIds: number[]) {
    this.esriLoader.loadModules([
      'esri/toolbars/edit',
      'esri/tasks/query',
      'dojo/_base/event',
    ])
      .then(([
        Edit,
        Query,
        event
      ]) => {
        const featureLayersToSetEditable = this.loadedFeatureLayers.filter(layers => layerIds.includes(layers.layerId));
        featureLayersToSetEditable.forEach(featureLayer => {
          // Set feature layer editable
          const editToolbar = new Edit(this.map);

          // Edition ON
          let editingEnabled = false;
          featureLayer.on('dbl-click', (clickEvent) => {
            event.stop(clickEvent);
            if (editingEnabled) {
              editingEnabled = false;
              editToolbar.deactivate();
              this.map.enableDoubleClickZoom();
              featureLayer.clearSelection();
            } else {
              editingEnabled = true;
              this.map.disableDoubleClickZoom();
              editToolbar.activate(Edit.MOVE, clickEvent.graphic);
              // select the feature to prevent it from being updated by map navigation
              const query = new Query();
              // TODO : investigate this ???
              // query.objectIds = [clickEvent.graphic.attributes[featureLayer.objectIdField]];
              featureLayer.selectFeatures(query);
            }
          });

          // Edition OFF
          editToolbar.on('deactivate', (deactivateEvent) => {
            if (deactivateEvent.info.isModified) {
              featureLayer.applyEdits(null, [deactivateEvent.graphic], null);
            }

            // Buffer on single point
            this.bufferSinglePoint(deactivateEvent.graphic);

            // Creates a circle on end edition
            // this.createCircle(deactivateEvent.graphic).then((graphic: any) => {
            //   featureLayer.add(graphic);
            // });

            // Doesn't save anything
            // featureLayer.applyEdits(graphic);
          });
        });
      })
      .catch(error => console.error(error));
  }

  // Creates a manual circle around a single point
  createCircle(centerPoint: any) {
    return this.esriLoader.loadModules([
      'esri/graphic',
      'esri/geometry/Point',
      'esri/geometry/Circle',
      'esri/symbols/SimpleFillSymbol',
    ])
      .then(([
        Graphic,
        Point,
        Circle,
        SimpleFillSymbol
      ]) => {
        // Create new circle on end edition
        const radius = 70;
        const symbol = new SimpleFillSymbol().setColor(null).outline.setColor('blue');
        // Create Point + Circle
        const point =
          new Point(centerPoint.geometry.x, centerPoint.geometry.y, this.map.spatialReference);
        const circle = new Circle({
          center: point,
          radius: radius
        });
        // Creates the graphic element
        const graphic = new Graphic(circle, symbol);
        return graphic;
      });
  }

  // Calls the buffer service to create a circle around a single point
  bufferSinglePoint(centerPoint: any) {
    this.esriLoader.loadModules([
      'esri/tasks/BufferParameters',
      'esri/Color',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/graphic'
    ])
      .then(([
        BufferParameters,
        Color,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic
      ]) => {
        // Set the buffer parameters
        const bufferParams = new BufferParameters();
        bufferParams.outSpatialReference = this.map.spatialReference;
        bufferParams.unit = 9036;  // kilometers
        bufferParams.distances = [0.1];  // 100 m
        bufferParams.geometries = [centerPoint.geometry];

        this.geometryService.buffer(bufferParams, (bufferedGeometries) => {
          const symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255, 0, 0, 0.65]), 2
            ),
            new Color([255, 0, 0, 0.35])
          );

          bufferedGeometries.forEach(geometry => {
            const graphic = new Graphic(geometry, symbol);
            this.map.graphics.add(graphic);
          });
        });
      });
  }

  // Activates the draw edition
  activateToolbar(): void {
    this.esriLoader.loadModules([
      'esri/toolbars/draw'
    ])
      .then(([
        Draw
      ]) => {
        this.drawToolbar.activate(Draw.EXTENT);
      });
  }

  initBufferMassSelection(layerIds: number[]) {
    this.esriLoader.loadModules([
      'esri/toolbars/draw',
      'esri/tasks/query',
      'esri/layers/FeatureLayer',

      'esri/tasks/BufferParameters',
      'esri/Color',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/graphic'
    ])
      .then(([
        Draw,
        Query,
        FeatureLayer,

        BufferParameters,
        Color,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic
      ]) => {
        const featureLayersToSetEditable = this.loadedFeatureLayers.filter(layers => layerIds.includes(layers.layerId));
        const testLayer = featureLayersToSetEditable[0];

        // Set infoWindow Size
        this.map.infoWindow.resize(175, 100);

        // Get the Toolbar instance
        this.drawToolbar.on('draw-complete', (RectangularSelectorGeometry) => {

          this.drawToolbar.deactivate();

          // Select the points within the extent
          const query = new Query();
          query.geometry = RectangularSelectorGeometry.geometry;

          testLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, (features) => {
            // calculate the convex hull
            const points = features.map((feature) => {
              return feature.geometry;
            });

            // Apply Buffer on points
            const bufferParams = new BufferParameters();
            bufferParams.outSpatialReference = this.map.spatialReference;
            bufferParams.unit = 9036;  // kilometers
            bufferParams.distances = [0.1];  // 100 m
            bufferParams.geometries = points;
            bufferParams.unionResults = true;

            this.geometryService.buffer(bufferParams, (bufferedGeometries) => {
              const symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color([255, 0, 0, 0.65]), 2
                ),
                new Color([255, 0, 0, 0.35])
              );

              bufferedGeometries.forEach(bufferedGeometry => {
                const graphic = new Graphic(bufferedGeometry, symbol);
                this.map.graphics.add(graphic);
              });
            });
          });
        });
      });
  }
}
