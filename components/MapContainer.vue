<template>
  <div>
    <div id="map">

    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer } from "ol/layer";
import { register } from "ol/proj/proj4";
import Projection from "ol/proj/Projection";
import proj4 from "proj4";


proj4.defs("EPSG:32643", "+proj=utm +zone=43 +datum=wgs84 +no_defs");
register(proj4);

export default {
    mounted () {
        var extent = [291627, 904686, 958569, 1571628];
        var projection = new Projection({
        code: "EPSG:32643",
        extent: extent
        });

        var map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    title: "OSM",
                    source: new OSM(),
                    opacity: 0.5
                })
            ],
            view: new View({
                projection: projection,
                units: "metric",
                extent: extent,
                zoom: 0,
                maxZoom: 13,
                minZoom: 0,
                maxResolution: 2605.2421875,
                center: [654496.136597752, 1155181.26900064],
                numZoomLevels: 13,
            })

        })

        //***on button click***

        //---geojson data for heatmap---
        var heatmap_data = {
        type: "FeatureCollection",
        features: [
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [716015.7709315167, 941114.3812981017]
            },
            properties: { title: "HeatmapPts", id: 111, name: "sample 1" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [686213.47091037, 1093486.3776117]
            },
            properties: { title: "HeatmapPts", id: 222, name: "sample 2" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [687067.04391223, 1094462.7275206]
            },
            properties: { title: "HeatmapPts", id: 333, name: "sample 3" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [715175.426212967, 940887.9894195743]
            },
            properties: { title: "HeatmapPts", id: 444, name: "sample 4" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [715199.78960381, 940877.6180225]
            },
            properties: { title: "HeatmapPts", id: 555, name: "sample 5" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [687214.60645801, 1094362.868384]
            },
            properties: { title: "HeatmapPts", id: 666, name: "sample 6" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [614971.473, 1218630.894]
            },
            properties: { title: "HeatmapPts", id: 777, name: "sample 7" }
            },
            {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [620197.188, 1222790.136]
            },
            properties: { title: "HeatmapPts", id: 888, name: "sample 8" }
            }
        ]
        };

        var heatfeature = new VectorSource({
            features: new GeoJSON().readFeatures(heatmap_data, {
                dataProjection: "EPSG:32643",
                featureProjection: "EPSG:32643"
            })
            });

            var blur = 20;
            var radius = 10;

            var heatmaplayer = new HeatmapLayer({
            title: "HeatMap",
            source: heatfeature,
            blur: blur,
            radius: radius,
            weight: function (feature) {
                return 10;
            }
            });
            map.addLayer(heatmaplayer);



    }
}
</script>

<style>

</style>