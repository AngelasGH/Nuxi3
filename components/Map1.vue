<template>
    <div>
      <div class="container">
        <h1 class="title">nuxt-socket-io-demo</h1>
      </div>
  
      <div id="map"></div>
    </div>
  </template>
  
  <script>
  import "ol/ol.css";
  import { Map, View } from "ol";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import VectorSource from "ol/source/Vector";
  import GeoJSON from "ol/format/GeoJSON";
  import VectorLayer from "ol/layer/Vector";
  import Style from 'ol/style/Style';
  import Circle from 'ol/geom/Circle';
  import Fill from 'ol/style/Fill';
  import Stroke from 'ol/style/Stroke';

  export default {

    data() {
        return {
            map: null,
            coordinates: [],
            VectorSource: new VectorSource(),
            VectorLayer: new VectorLayer({
                source: this.VectorSource,
                style: new Style({
                    image: new Circle({
                        radius: 5,
                        fill: new Fill({
                            color: "rgba(255, 0, 0, 0.8)"
                        }),
                        stroke: new Stroke({
                        color: "white",
                        width: 2
                        })
                    })
                })
            }),
        }
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
    mounted(){

        const raster = new TileLayer({
            source: new OSM()
        })

        this.map = new Map({
            target: "map",
            
            layers: [ raster,
                this.VectorLayer
            ],
            view: new View({
                projection: 'EPSG:4326',
                units: "degrees",
                zoom: 19,
                minZoom: 0,
                center: [125.54067,8.94760],
                
            })
        })

        this.socket = this.$nuxtSocket({
            name: "home", // select "main" socket from nuxt.config.js - we could also skip this because "main" is the default socket
      });

      // Listening to the socket.io server.
      this.socket.on("connect", () => {
        console.log("Connected to socket.io!");
        this.error = null;
      });

      // Listening to the socket.io server.
      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket.io!");
        this.error = "Disconnected from socket.io";
      });

     
      this.socket.on("message", (msg) => {
        this.error = null;
        const tokens = this.tokenizeMessage(msg);
        const chunk = this.splitIntoChunks(tokens, 5);
        //this.message = chunk;
        const len = chunk.length;
        const coordinate = this.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102]);
        //vm.numberofVehicles = vm.updateNumberofVehicles(len); 
        // this.coordinates = coordinates;
        // this.numberofVehicles = len;

        const coordinates = this.generateRandomPoints(len, [8.94760, 125.54078, 8.94758, 125.54102])
            this.vectorSource.clear();
            this.vectorSource.addFeature(new Feature(new Point(coordinates)));
        });

      this.socket.on("reconnect", () => {
        console.log("reconnected from socket.io!");
        this.error = null;
      });
    

    //     new Map({
    //     target: "map",
    //     layers: [ raster ],
    //     view: new View({
    //       projection: 'EPSG:4326',
    //       units: "degrees",
    //       zoom: 19,
    //       //maxZoom: 13,
          
    //       //maxResolution: 2605.2421875,
    //       //center: proj.fromLonLat([125.54067,8.94760]),
    //       center: [125.54067,8.94760],
    //       numZoomLevels: 13
    //     })
    // })
    }

    }
</script>

<style>

#map{
    width: 100%;
    height: 100vh;
}

</style>