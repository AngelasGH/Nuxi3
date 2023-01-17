<template>
  <div>
    <div id="map" class="map"></div>

  </div>
</template>

<script>
import OSM from "ol/source/OSM";
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
//import {ScaleLine, defaults as defaultControls} from 'ol/control.js';


export default {
    mounted(){

const map = new Map({
//   controls: defaultControls().extend([
//     new ScaleLine({
//       units: 'degrees',
//     }),
//   ]),
  layers: [
    new TileLayer({
        source: new OSM(),
    })
  ],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [125.54067,8.94760],
    zoom: 19,
  }),
});

    }
}
</script>

<style>
.map {
    width: 100%;
    height: 100vh;
  }

</style>