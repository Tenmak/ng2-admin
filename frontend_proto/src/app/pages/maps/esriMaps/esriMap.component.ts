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
  baseURL = {
    mapToponymesURL: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/toponymes/MapServer',
    mapViaNavigoURL: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/ViaNavigo/MapServer',
    imageLayerURL: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/MapServer',
    vectorsLayerBaseURL: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/FeatureServer/',
    geometryServiceURL: 'https://reflex-crt.akka.eu:6443/arcgis/rest/services/Utilities/Geometry/GeometryServer',
  }
  loadedFeatureLayers: any[] = [];
  geometryService = null;
  drawToolbar: any = null;
  drawToolbar2: any = null;

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
    const featureLayersToBufferize = [0];

    this.createMap(esriModules);
    this.initGeometryService();
    this.initDrawToolbar();
    this.initCustomBaseMap();
    // this.loadImageLayer();
    this.loadFeatureLayers(featureLayersConfiguration)
      .then((loadedFeatureLayers) => {
        if (this.loadedFeatureLayers.length > 0) {
          // Wait for the DOM elements to be loaded to operate
          setTimeout(() => {
            // this.setLayersEditable(editableFeatureLayers);
            this.bufferMassSelection(featureLayersToBufferize);
            this.bufferAroundAreas(featureLayersToBufferize);
          }, 500);
        }
      });
  }

  // Create a map at the root dom node of this component
  createMap([Map, Point, SpatialReference, Extent]) {
    const spatialReference = new SpatialReference({ wkid: 102110 });
    const options = {
      center: new Point(652628, 6861795, spatialReference),
      zoom: 7,
    };
    this.map = new Map(this.mapEl.nativeElement, options);
    // Avoid inner script errors when dojo script is not initialized correctly
    this.map.spatialReference = spatialReference;
    // const extent = new Extent(-122.68, 45.53, -122.45, 45.60, spatialReference);
    // this.map.extent = extent;
  }

  // Sets the geometryService instance to call methods from the REST API
  initGeometryService() {
    this.esriLoader.loadModules([
      'esri/tasks/GeometryService'
    ])
      .then(([
        GeometryService
      ]) => {
        this.geometryService = new GeometryService(this.baseURL.geometryServiceURL);
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
        this.drawToolbar2 = new Draw(this.map);
      });
  }

  // Initialize the baseMap of the map
  initCustomBaseMap() {
    this.esriLoader.loadModules([
      'esri/layers/ArcGISTiledMapServiceLayer'
    ])
      .then(([ArcGISTiledMapServiceLayer, Point, SpatRef]) => {
        const tiledLayer = new ArcGISTiledMapServiceLayer(this.baseURL.mapViaNavigoURL);
        this.map.addLayer(tiledLayer);
      });
  }

  // Loads the image containing all the layers for a fast display
  loadImageLayer() {
    this.esriLoader.loadModules(['esri/layers/ArcGISDynamicMapServiceLayer'])
      .then(([ArcGISDynamicMapServiceLayer]) => {
        const dynamicLayer = new ArcGISDynamicMapServiceLayer(this.baseURL.imageLayerURL);
        this.map.addLayer(dynamicLayer);
        // this.configureLayerInteractions(this.baseURL.imageLayerURL);
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
    return this.esriLoader.loadModules(['esri/layers/FeatureLayer'])
      .then(([FeatureLayer]) => {
        // Create the corresponding FeatureLayers
        const featureLayersToLoad = [];
        layersConfiguration.forEach(layerConf => {
          featureLayersToLoad.push(new FeatureLayer(this.baseURL.vectorsLayerBaseURL + layerConf.id, layerConf.options));
        });
        // Add them to the map
        this.map.addLayers(featureLayersToLoad);
        return this.loadedFeatureLayers = featureLayersToLoad;
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
        if (featureLayersToSetEditable.length === 0) {
          console.error('failed to initialize editable layers : retrying...');
          // setTimeout(() => {
          //   return this.setLayersEditable(layerIds);
          // }, 0);
        }
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
      });
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
        bufferParams.distances = [0.05];  // 100 m
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
            this.map.add(graphic);
          });
        });
      });
  }

  // Manages the drawing tool to create buffer around a query selection
  bufferMassSelection(layerIds: number[]) {
    this.esriLoader.loadModules([
      'esri/toolbars/draw',
      'esri/tasks/query',
      'esri/layers/FeatureLayer',
      'esri/tasks/BufferParameters',
      'esri/Color',
      'esri/geometry/Point',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/graphic',
      'esri/layers/GraphicsLayer'
    ])
      .then(([
        Draw,
        Query,
        FeatureLayer,
        BufferParameters,
        Color,
        Point,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic,
        GraphicsLayer
      ]) => {
        const featureLayersConcerned = this.loadedFeatureLayers.filter(layers => layerIds.includes(layers.layerId));
        if (featureLayersConcerned.length === 0) {
          console.error('failed to bind the drawing tool to the feature layers : retrying...');
          // setTimeout(() => {
          //   return this.bufferMassSelection(layerIds);
          // }, 0);
        }

        // Get the Toolbar instance
        this.drawToolbar.on('draw-complete', (RectangularSelectorGeometry) => {
          this.drawToolbar.deactivate();

          // Initialize the Query
          const query = new Query();
          query.geometry = RectangularSelectorGeometry.geometry;

          // Manage the actions for each configured layer
          featureLayersConcerned.forEach(featureLayer => {
            featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, (features) => {
              // Get the selected graphic points
              const points = features.map((feature) => {
                return feature.geometry;
              });

              // Only process if one point has been selected
              if (points.length > 0) {
                // Get the Graphic layer if it exists or create it otherwise
                let graphicLayer = this.map.getLayer('bufferGraphics');
                if (!graphicLayer) {
                  graphicLayer = new GraphicsLayer({ id: 'bufferGraphics' });
                  this.map.addLayer(graphicLayer);
                }

                // Calculate the convex Hull geometry
                this.geometryService.convexHull(points, (convexHullGeometry) => {
                  let convexHullSymbol;
                  switch (convexHullGeometry.type) {
                    case 'polyline':
                      convexHullSymbol = new SimpleLineSymbol();
                      break;
                    case 'polygon':
                      convexHullSymbol = new SimpleFillSymbol();
                      break;
                  }

                  // Create the BufferParameters
                  const bufferParams = new BufferParameters();
                  bufferParams.outSpatialReference = this.map.spatialReference;
                  bufferParams.unit = 9036;  // kilometers
                  bufferParams.distances = [0.04];  // 40 m
                  bufferParams.geometries = [convexHullGeometry];

                  // Apply the buffer on the ConvexHullResult
                  this.geometryService.buffer(bufferParams, (bufferedGeometries) => {
                    const symbol = new SimpleFillSymbol(
                      SimpleFillSymbol.STYLE_SOLID,
                      new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0, 0.65]), 2
                      ),
                      new Color([255, 0, 0, 0.35])
                    );

                    // Show the buffer result
                    bufferedGeometries.forEach(bufferedGeometry => {
                      const graphic = new Graphic(bufferedGeometry, symbol, { buffer: true });
                      graphicLayer.add(graphic);
                    });
                  });
                });
              }
            });
          });
        });
      });
  }

  // Manages the drawing tool to create a buffer graphic around several buffer on query selection
  bufferAroundAreas(layerIds: number[]) {
    this.esriLoader.loadModules([
      'esri/toolbars/draw',
      'esri/tasks/query',
      'esri/layers/FeatureLayer',
      'esri/tasks/BufferParameters',
      'esri/Color',
      'esri/geometry/Point',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/graphic',
      'esri/layers/GraphicsLayer'
    ])
      .then(([
        Draw,
        Query,
        FeatureLayer,
        BufferParameters,
        Color,
        Point,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic,
        GraphicsLayer
      ]) => {
        const featureLayersConcerned = this.loadedFeatureLayers.filter(layers => layerIds.includes(layers.layerId));
        if (featureLayersConcerned.length === 0) {
          console.error('failed to bind the drawing tool to the feature layers : retrying...');
          // setTimeout(() => {
          //   return this.bufferMassSelection(layerIds);
          // }, 0);
        }

        // Get the Toolbar instance
        this.drawToolbar2.on('draw-complete', (RectangularSelectorGeometry) => {
          this.drawToolbar2.deactivate();

          // Initialize the Query
          const query = new Query();
          query.geometry = RectangularSelectorGeometry.geometry;

          // Manage the actions for each configured layer
          featureLayersConcerned.forEach(featureLayer => {
            featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, (features) => {
              // Get the selected graphic points
              const points = features.map((feature) => {
                return feature.geometry;
              });

              // Only process if one point has been selected
              if (points.length > 0) {
                // Get the Graphic layer if it exists or create it otherwise
                let graphicLayer = this.map.getLayer('bufferGraphics');
                if (!graphicLayer) {
                  graphicLayer = new GraphicsLayer({ id: 'bufferGraphics' });
                  this.map.addLayer(graphicLayer);
                }

                // Calculate the convex Hull geometry
                this.geometryService.convexHull(points, (convexHullGeometry) => {
                  let convexHullSymbol;
                  switch (convexHullGeometry.type) {
                    case 'polyline':
                      convexHullSymbol = new SimpleLineSymbol();
                      break;
                    case 'polygon':
                      convexHullSymbol = new SimpleFillSymbol();
                      break;
                  }

                  // Create the BufferParameters
                  const bufferParams = new BufferParameters();
                  bufferParams.outSpatialReference = this.map.spatialReference;
                  bufferParams.unit = 9036;  // kilometers
                  bufferParams.distances = [0.04];  // 40 m
                  bufferParams.geometries = [convexHullGeometry];

                  // Apply the buffer on the ConvexHullResult
                  this.geometryService.buffer(bufferParams, (bufferedGeometries) => {
                    const symbol = new SimpleFillSymbol(
                      SimpleFillSymbol.STYLE_SOLID,
                      new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0, 0.65]), 2
                      ),
                      new Color([255, 0, 0, 0.35])
                    );

                    // Show the buffer result
                    bufferedGeometries.forEach(bufferedGeometry => {
                      /** Start the buffer of these **/
                      // Create the BufferParameters
                      const topBufferParams = new BufferParameters();
                      topBufferParams.outSpatialReference = this.map.spatialReference;
                      topBufferParams.unit = 9036;  // kilometers
                      topBufferParams.distances = [0.04];  // 40 m
                      topBufferParams.geometries = [bufferedGeometry];

                      // Apply the buffer on the last buffer result
                      this.geometryService.buffer(topBufferParams, (bufferedTopGeometries) => {
                        const symbolTopBuffer = new SimpleFillSymbol(
                          SimpleFillSymbol.STYLE_SOLID,
                          new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SOLID,
                            new Color([0, 0, 255, 0.45]), 2
                          ),
                          new Color([0, 0, 255, 0.15])
                        );

                        // Show the new buffer result
                        bufferedTopGeometries.forEach(bufferedTopGeometry => {
                          const topGraphic = new Graphic(bufferedTopGeometry, symbolTopBuffer, { buffer: true });
                          graphicLayer.add(topGraphic);
                        });
                      });
                    });
                  });
                });
              }
            });
          });
        });

      });
  }

  // Activates the first draw edition
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

  // Activates the second draw edition
  activateToolbar2(): void {
    this.esriLoader.loadModules([
      'esri/toolbars/draw'
    ])
      .then(([
        Draw
      ]) => {
        this.drawToolbar2.activate(Draw.EXTENT);
      });
  }
}
