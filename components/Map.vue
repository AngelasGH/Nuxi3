<template>
    <div>
      <div class="container">
        <h1 class="title">Traffic Heatmap</h1> 
         {{ message }} 
        <br>
        {{ numberofVehicles }}
        <br>
        {{ coordinates }}
        <!-- {{ VectorSource }} -->
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
  //import Heatmap from "ol/layer/Heatmap";
  import { Heatmap, Heatmap as HeatmapLayer } from "ol/layer";
  //import { register } from "ol/proj/proj4";
  //import VectorLayer from 'ol/layer/Vector';
  //import { Point } from 'ol/geom';
  //import Projection from "ol/proj/Projection";
  //import VectorLayer from "ol/layer/Vector";
  //import proj4 from "proj4";

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
        numberofVehicles: 12,
        blur: 13,
        radius: 9,
        coordinates: { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409276524912, 8.947595086167691 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409445910039, 8.94758513955327 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5408305431786, 8.947585553847167 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409817601673, 8.947597956610702 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54087855398134, 8.94758130525557 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54081530724056, 8.94758405486753 ] } } ] }
,
        // vector: new VectorSource({
        //     features: new GeoJSON().readFeatures(this.coordinates),
        //  }),
        Heatmap: new HeatmapLayer(),
        //    source: null,
        //    blur: 10,
        //    radius: 5,
        //    weight: function(feature){
        //      return 10;
        //    }
        //  }),
        raster: new TileLayer({
          source: new OSM()
        }),
        map: new Map(),
        error: null,
      };
    },

    methods: { 
        updateCoordinates(coordinates) {
          this.coordinates = coordinates;
          this.vector.clear();
          this.vector.addFeatures(new GeoJSON().readFeatures(this.coordinates));
      },

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
        //       this.addCoordinatesToHeatmap;
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
        return [lat,lon];
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
    },
    // addCoordinatesToHeatmap(coordinates){
    //   coordinates.forEach(coordinate => {
    //       const feature = new Feature({
    //         geometry: new Point(coordinate)
    //       });
    //       this.VectorSource.addFeature(feature);    
    //   });
    // },
    // updateHeatmap(coordinates){
    //   const newFeatures = new GeoJSON().readFeatures(coordinates);
    //   this.coordinates.clear();
    //   this.coordinates.addFeatures(newFeatures);
    // }
        
    // hasLayer(layers){
    //   let found = false;
    //   this.map.getLayers().forEach(l => {
    //     if(l === layer){
    //       found = true;
    //     }
    //   });
    //   return found;
    // }

   hasLayer(layer) {
    let found = false;
    this.map.getLayers().forEach(l => {
      
      if (l === layer) {
        found = true;
      }
       });
        return found;
    }

    
    // hasLayer(layer) {
    //   return this.map.getLayers().getArray().some(l => l === layer);
    // }
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
        console.log(msg);
        vm.error = null;
        const tokens = vm.tokenizeMessage(msg);
        const chunk = vm.splitIntoChunks(tokens, 5);
        vm.message = chunk;
        const len = chunk.length;
        const coordinates = vm.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102]);
        //vm.numberofVehicles = vm.updateNumberofVehicles(len); 
        vm.coordinates = coordinates;
        //console.log(typeof vm.coordinates);
        vm.numberofVehicles = len;

        //vm.VectorSource = coordinates;

        console.log("this is object " + JSON.stringify(vm.coordinates))

        // console.log(typeof vm.coordinates)

        //vm.coordinates = updateHeatmap(coordinates);

        //var myvectorSource = new VectorSource();

        //myvectorSource.addFeature(new Features( new Point(coordinates)));

        
      // const features = geoJSONFormat.readFeatures(vm.coordinates);
      // vm.VectorSource.addFeatures(features);


      });

      vm.socket.on("reconnect", () => {
        console.log("reconnected from socket.io!");
        vm.error = null;
      });

      //const  geoJSONFormat = new GeoJSON(); WSL
        
      // console.log("this is console")
      // console.log(vm.coordinates) 
      // console.log(typeof vm.coordinates)

      // var heatfeatures = new VectorSource({

      //   features: new GeoJSON().readFeatures(heatmap_data)
      
      // });

     var heatmap_data2 = { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409276524912, 8.947595086167691 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409445910039, 8.94758513955327 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5408305431786, 8.947585553847167 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409817601673, 8.947597956610702 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54087855398134, 8.94758130525557 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54081530724056, 8.94758405486753 ] } } ] }

      // this.$nextTick()
      // this.vector = new VectorSource({
      //   features: new GeoJSON().readFeatures(this.coordinates),
      // });

    //   //   console.log("this is console")
    //   //   console.log(heatfeatures)  

      //   const blur = 10;
      //   const radius = 5;
        
      //   this.Heatmap = new HeatmapLayer({
      //   source: this.vector,
      //   blur: blur,
      //   radius: radius,
      //   weight: function(feature){
      //     return 10;
      //   }
      // });
      
      //vm.map.addLayer(this.Heatmap);

      

      // const raster = new TileLayer({
      //   source: new OSM()
      // });

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
      

      //vm.map.addLayer(vm.Heatmap);
      console.log(vm.numberofVehicles);
      console.log("this is object down " +JSON.stringify(vm.coordinates))

      
       //this.map.addLayer(heatfeatures);
     
      //vm.map.addLayer(vm.Heatmap);
    
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

      var heatmap_data2 = { "type": "FeatureCollection", "features": [ { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409276524912, 8.947595086167691 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409445910039, 8.94758513955327 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5408305431786, 8.947585553847167 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.5409817601673, 8.947597956610702 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54087855398134, 8.94758130525557 ] } }, { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ 125.54081530724056, 8.94758405486753 ] } } ] }

      //vm.addToMap(map);

      // var heatfeatures = new VectorSource({
      //   features: new GeoJSON().readFeatures(heatmap_data2),
      // });

      // console.log("This is from mounted hook", heatfeatures);
      // console.log("This is from mounted hook heatmap_data", heatmap_data2);

      //const data = vm.generateRandomPoints(this.numberofVehicles, [8.94760, 125.54078, 8.94758, 125.54102])
      //const format = new GeoJSON();
      //const features = format.readFeatures(data);

      //var data = this.coordinates;

      //this.VectorSource = new VectorSource();

      // var heatmapSource = new VectorSource({
      //   wrapX: false,
      // });

      // heatmapSource.addFeature(new Feature({
      //   geometry: new Point(this.coordinates),
      //   weight: weight,
      // }));
      //vm.map.addLayer(this.Heatmap);    
    },
    watch: {
     coordinates: {
        handler: function(newValue, oldValue) {
          console.log("message changed from", oldValue, "to", newValue);
          this.coordinates = newValue;
          console.log("This is now the new value", newValue);
          console.log("this is object watch " +JSON.stringify(this.coordinates))
          console.log("this is object watch " +this.coordinates);

          //var geojson = new GeoJSON();
          // var geojsonText = JSON.parse(this.coordinates);
          //var features = geojson.readFeatures(this.coordinates);

          //console.log("this is my geojson", features);

          const vector = new VectorSource({
            features: new GeoJSON().readFeatures(newValue),
          });

          if (this.hasLayer(this.Heatmap)) {
            this.map.removeLayer(this.Heatmap);
          }
          this.Heatmap = new HeatmapLayer({
            source: vector,
            blur: this.blur,
            radius: this.radius,
            weight: function(feature){
              return 10;
            }
          });

          this.map.addLayer(this.Heatmap);
             
          
          // this.Heatmap = new HeatmapLayer({
          //   source: vector,
          //   blur: this.blur,
          //   radius: this.radius,
          //   weight: function(feature){
          //     return 10;
          //   }
          // });


          //this.Heatmap.getSource().clear();
          
          // this.$nextTick(() => {
          //  this.Heatmap.getSource(this.vector);
          // })
          // //this.map.addLayer(this.Heatmap);

          
        
        //this.map.addLayer(this.Heatmap);
        //this.map.renderSync();
         //this.map.removeLayer(this.Heatmap);
          // if(this.hasLayer(this.Heatmap)){
          //   this.map.removeLayer(this.Heatmap);
          //   console.log("Markers layer is not present on the map.")
          // }else{
          //   this.map.addLayer(this.Heatmap);
          //   console.log("Markers layer is present on the map.");

          // }
          
          
          
            

    
          
         
          

          


          //console.log("this is vector",this.coordinates);

          // this.$nextTick(() => {
          //   this.Heatmap.setSource(this.vector); 
          // }) 

          
          
          //this.map.addLayer(this.Heatmap);

          // const geojson = new GeoJSON();
          // const features = geojson.readFeatures(newValue);

      //   this.VectorSource = new VectorSource({
      //     features: new GeoJSON().readFeatures(this.coordinates),
      //   });


      // //   console.log("this is console")
      // //   console.log(heatfeatures)  
      
      //   });

      //   this.map.addLayer(this.heatmaplayer);

      },
        deep: true,
        immediate: true
      },
      // vector: {
      //   handler: function (newValue, oldValue){
      //       this.vector = newValue;
      //       console.log("New Value vector", newValue);
      //       console.log("Old Value vetor", oldValue);
      //     //   this.$nextTick(() => {
      //     //   this.Heatmap.setSource(newValue); 
      //     // }) 
      //   },
      //   deep: true,
      //   immediate: true
      // }
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