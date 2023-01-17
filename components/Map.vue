  <template>
      <div>
        <div class="container">
          <h1 class="title">Traffic Heatmap</h1> 
          {{ message }} 
          <br>
          {{ numberofVehicles }}
          <br>
          {{ coordinates }}
        </div>

        <div id="map">
          
        </div>
      </div>
  </template>
  
  <script>
  import "ol/ol.css";
  import * as proj from 'ol/proj';
  import { Feature, Map, View } from "ol";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import VectorSource from "ol/source/Vector";
  import GeoJSON from "ol/format/GeoJSON";
  import { Heatmap, Heatmap as HeatmapLayer } from "ol/layer";
  
  export default {
    data() {
      return {
        message: [],
        numberofVehicles: 12,
        blur: 13,
        radius: 9,
        coordinates: { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409276524912, 8.947595086167691 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409445910039, 8.94758513955327 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5408305431786, 8.947585553847167 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409817601673, 8.947597956610702 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54087855398134, 8.94758130525557 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54081530724056, 8.94758405486753 ] } } ] },
        Heatmap: new HeatmapLayer(),
        raster: new TileLayer({
          source: new OSM()
        }),
        map: new Map(),
        error: null,
      };
    },

    methods: { 

    tokenizeMessage(message) {
      try{
        // remove whitespace and split message into an array of strings/numbers
        const tokens = message.replace(/[[(' ')]]*/g,'').split(',').map(str => {
            if(isNaN(str)){
              return str;
            }else{
              return Number(str);
              }
          });
            
          return tokens;

        }  catch(err) {
            // return an empty array if an error occurs
            console.error(err);
            return [];
          }
    },
    
    // Splitting the array into chunks of 5.
    splitIntoChunks(arr, chunkSize) {
      try {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          const chunk = arr.slice(i, i + chunkSize);  
          res.push(chunk);
          console.log("chunk: i: "+i+"chunk size: "+chunkSize+"Chunk: "+chunk);
        }

        return res;

      } catch (err) {
          //return an empty array if an error occurs
          console.error(err);
          return [];
      }
    },
        
    generateRandomPoint(bbox) {
      // bbox is an optional parameter in the format [minLon, minLat, maxLon, maxLat]
      let lon, lat;
      if (bbox) {
        lon = Math.random() * (bbox[2] - bbox[0]) + bbox[0];
        lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
      } else {
        lon = Math.random() * 360 - 180;
        lat = Math.random() * 180 - 90;
      }

      return [lat,lon];
    },

    // Generating random points within a bounding box.
    generateRandomPoints(count, bbox) {
      let features = [];
      for (let i = 0; i < count; i++) {
        let point = {
          type: "Feature",
            geometry: {
              type: "Point",
              coordinates: this.generateRandomPoint(bbox)
            }
          };
        features.push(point);
      }
      return {
        type: "FeatureCollection",
        features: features
      };
    },
  
    // Checking if the layer is already added to the map.
    hasLayer(layer) {
      let found = false;
      this.map.getLayers().forEach(l => {
        if (l === layer) {
          found = true;
        }
      });
        return found;
    }

  },
    mounted() {
      const vm = this;
      
      // use "main" socket defined in nuxt.config.js
      vm.socket = this.$nuxtSocket({
        name: "home", // select "main" socket from nuxt.config.js - we could also skip this because "main" is the default socket
      });

     // Listening to the socket.io server.
      vm.socket.on("connect", () => {
        console.log("Connected to socket.io!");
        vm.error = null;
      });

      // Listening to the socket.io server.
      vm.socket.on("disconnect", () => {
        console.log("Disconnected from socket.io!");
        vm.error = "Disconnected from socket.io";
      });
  
      // Receiving a message from the server and then splitting it into chunks of 5.
      vm.socket.on("message", (msg) => {
        console.log(msg);
        vm.error = null;
        const tokens = vm.tokenizeMessage(msg);
        const chunk = vm.splitIntoChunks(tokens, 5);
        vm.message = chunk;
        const len = chunk.length;
        const coordinates = vm.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102]);
        vm.coordinates = coordinates;
        vm.numberofVehicles = len;
        //console.log("this is object " + JSON.stringify(vm.coordinates))
      });

      vm.socket.on("reconnect", () => {
        console.log("reconnected from socket.io!");
        vm.error = null;
      });

      // Creating a new map object.
      vm.map = new Map({
        target: "map",
        layers: [ vm.raster ],
        view: new View({
          projection: 'EPSG:4326',
          units: "degrees",
          zoom: 19,
          maxZoom: 22,
          minZoom: 0,
          //maxResolution: 2605.2421875,
          //center: proj.fromLonLat([125.54067,8.94760]),
          center: [125.54067,8.94760],
          numZoomLevels: 13
        })
      });
  
      console.log(vm.numberofVehicles);
      console.log("this is object down " +JSON.stringify(vm.coordinates))

    },
    watch: {
     coordinates: {
        handler: function(newValue, oldValue) {
          console.log("message changed from", oldValue, "to", newValue);
          this.coordinates = newValue;
          console.log("This is now the new value", newValue);
          console.log("this is object watch " +JSON.stringify(this.coordinates))
          console.log("this is object watch " +this.coordinates);

          const vector = new VectorSource({
            features: new GeoJSON().readFeatures(newValue),
          });

          // Checking if the layer is already added to the map.
          if (this.hasLayer(this.Heatmap)) {
            this.map.removeLayer(this.Heatmap);
          }

          // Creating a new heatmap layer.
          this.Heatmap = new HeatmapLayer({
            source: vector,
            blur: this.blur,
            radius: this.radius,
            weight: function(feature){
              return 10;
            }
          });

          // Adding the heatmap layer to the map.
          this.map.addLayer(this.Heatmap);
            
        },

        deep: true,
        immediate: true

      },
    }
  };
  </script>
  
  <style scoped>

  *{
    padding: 0;
    margin: 0;
  }

  #map{
    height: 100vh;
    width: 100%;
    
  }
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }
  
  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }
  
  .links {
    padding-top: 15px;
  }

  </style>