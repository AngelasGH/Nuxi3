 <template>
    <div>
      <div class="container">
        <h1 class="title">nuxt-socket-io-demo</h1>
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
  import { Map, View, Feature, Point } from "ol";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import VectorSource from "ol/source/Vector";
  import VectorLayer from "ol/layer/Vector";
  import GeoJSON from "ol/format/GeoJSON";
  //import Heatmap from "ol/layer/Heatmap";
  import { Heatmap as HeatmapLayer } from "ol/layer";
  
  import Circle from "ol/style/Circle";
  import Fill from "ol/style/Fill";
  import Stroke from "ol/style/Stroke";



  //import { register } from "ol/proj/proj4";
  // import Projection from "ol/proj/Projection";
  // import VectorLayer from "ol/layer/Vector";
  // import proj4 from "proj4";

  //import 'geojson-random';
  //var geojsonRandom = require("geojson-random");

 // Defining the projection of the map.
 //  proj4.defs("EPSG:4326", "+proj=longlat +datum=wgs84 +no_defs");
  // register(proj4);

  // register(proj4);
  // proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
  
  export default {
    data() {
      return {
        message: [],
        numberofVehicles: 0,
        coordinates: [],
        VectorSource: new VectorSource(),
        VectorLayer: new VectorLayer({
            
            source: this.vectorSource,
            style: new Style({
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                    color: "rgba(255, 0, 0, 0.8)"
                    })
                }),
                stroke: new Stroke({
                    color: "white",
                    width: 2
                })
            })
        }),
        map: null,
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
        // // Creating random coordinates for the number of vehicles.
        // createRandomCoordinates(numberofVehicles){
        //   try{
        //      // bounding box for 1 roadside in intersection
        //       var minLat = 8.94762;
        //       var maxLat = 8.94759;
        //       var minLon = 125.54105;
        //       var maxLon = 125.54106;

        //       const coordinates = [];

        //       for(let i = 0; i < numberofVehicles; i++){
        //             var randomLat = minLon + (Math.random() * (maxLon - minLon));
        //             var randomLon = minLat + (Math.random() * (maxLat - minLat));
        //             var point = [randomLat, randomLon];
        //             coordinates.push(point);
        //             console.log(point);
        //         }
        //       return coordinates;

        //     }catch(err){
        //       console.error(err);
        //       return [];
        //     }
        // },

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
        return [lon, lat];
    },
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

     
      vm.socket.on("message", (msg) => {
        vm.error = null;
        const tokens = vm.tokenizeMessage(msg);
        const chunk = vm.splitIntoChunks(tokens, 5);
        vm.message = chunk;
        const len = chunk.length;
        const coordinates = vm.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102]);
        //vm.numberofVehicles = vm.updateNumberofVehicles(len); 
        vm.coordinates = coordinates;
        vm.numberofVehicles = len;

        const heatmap_coords = vm.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102]);
        vm.vectorSource.clear();
        vm.VectorSource.addFeature(new Feature(new Point(heatmap_coords)));
    });

      vm.socket.on("reconnect", () => {
        console.log("reconnected from socket.io!");
        vm.error = null;
      });
    
      // const map = new Map({
      //   target: "map",
      //   layers: [
      //     new TileLayer({
      //       title: "OSM",
      //       source: new OSM(),
            
      //     })
      //   ],
      //   view: new View({
      //     //units: "degrees",
      //     zoom: 10,
      //     //maxZoom: 13,
      //     minZoom: 0,
      //     maxResolution: 2605.2421875,
      //     center: proj.fromLonLat([125.54067,8.94760]),
      //     numZoomLevels: 13
      //   })
      // });

      // register(proj4);
      // proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
      // var extent = [122.60240406728053, 10.309132304891307, 127.74261870925744, 7.4527356619463205];
      // var projection = new Projection({
      //   code: "EPSG:4326",
      //   extent: extent
      // });


      // const len_num = vm.numberofVehicles;
      
      // const heatmap_data = this.generateRandomPoints(len_num,[8.94760, 125.54078, 8.94758, 125.54102])

      //const heatmap_data = coordinates;


      var heatmap_data = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54077705061553,
                8.947613421086189
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54101835553405,
                8.947598523053813
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54084201732303,
                8.947612275081696
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54089422271369,
                8.947609983076944
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54094410786672,
                8.947607691072108
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54098239182031,
                8.947601961061096
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54086289947975,
                8.947603107063529
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54091858523026,
                8.947601961061096
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54082113516637,
                8.947611129079291
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54079329229216,
                8.947612275081696
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54088378163647,
                8.947603107063529
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                125.54096150966359,
                8.947598523053813
              ],
              "type": "Point"
            }
          }
        ]
      }


    //   var heatmap_data2 = { 
    //   "type": "FeatureCollection", 
    //   "features": [ { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.5409276524912, 8.947595086167691 ] 
    //         } 
    //     }, { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.5409445910039, 8.94758513955327 ] 
    //         } 
    //     }, { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.5408305431786, 8.947585553847167 ] 
    //         } 
    //     }, { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.5409817601673, 8.947597956610702 ] 
    //         } 
    //     }, { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.54087855398134, 8.94758130525557 ] 
    //         } 
    //     }, { 
    //         "type": "Feature", 
    //         "geometry": { 
    //             "type": "Point", 
    //             "coordinates": [ 125.54081530724056, 8.94758405486753 ] 
    //         } 
    //     } 
    // ] }

      // var heatfeature = new VectorSource({
      //   features: new GeoJSON().readFeatures(heatmap_data),
      // });

      //const data = vm.generateRandomPoints(this.numberofVehicles, [8.94760, 125.54078, 8.94758, 125.54102])
      //const format = new GeoJSON();
      //const features = format.readFeatures(data);

      var data = this.coordinates;

      const heatfeatures = new VectorSource({
        features: new GeoJSON().addFeatures(data)
      });

      const blur = 20;
      const radius = 10;

      const heatmaplayer = new HeatmapLayer({
        source: heatfeatures,
        blur: blur,
        radius: radius,
        weight: function(feature){
          return 10;
        }
      });

      const raster = new TileLayer({
        source: new OSM()
      })

      new Map({
        target: "map",
        layers: [ raster, heatmaplayer ],
        view: new View({
          projection: 'EPSG:4326',
          units: "degrees",
          zoom: 19,
          //maxZoom: 13,
          minZoom: 0,
          //maxResolution: 2605.2421875,
          //center: proj.fromLonLat([125.54067,8.94760]),
          center: [125.54067,8.94760],
          numZoomLevels: 13
        })
      });

    },
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
  