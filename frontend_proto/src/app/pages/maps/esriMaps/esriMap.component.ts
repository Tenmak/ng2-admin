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

    constructor(
        private route: ActivatedRoute,
        private esriLoader: EsriLoaderService
    ) { }

    ngOnInit() {
        if (this.map) {
            // map is already initialized
            return;
        }

        // get the required esri classes from the route
        const esriModules = this.route.snapshot.data['esriModules'];
        this._createMap(esriModules);

        // Test add layer 1
        // this.esriLoader.loadModules(['esri/layers/ArcGISTiledMapServiceLayer', 'esri/layers/ArcGISDynamicMapServiceLayer'])
        //     .then(([ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer]) => {
        //         const basemap =
        //             new ArcGISTiledMapServiceLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer');
        //         const statesLayer =
        //             new ArcGISDynamicMapServiceLayer(
        //                 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer'
        //             );
        //         this.map.addLayers([basemap, statesLayer]);
        //     });

        // Test add layer 2
        this.esriLoader.loadModules(['esri/layers/ArcGISDynamicMapServiceLayer'])
            .then(([ArcGISDynamicMapServiceLayer]) => {
                const statesLayer =
                    new ArcGISDynamicMapServiceLayer(
                        'https://reflex-crt.akka.eu:6443/arcgis/rest/services/REFLEX_OM_FA/MapServer'
                    );
                this.map.addLayer(statesLayer);
            });
    }

    // create a map at the root dom node of this component
    _createMap([Map]) {
        this.map = new Map(this.mapEl.nativeElement, {
            center: [2.341483, 48.858435],
            zoom: 16,
            basemap: 'dark-gray'
        });
    }
}
