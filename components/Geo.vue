<template>
  <div>
    <div> This is Geo Page</div>
    <div> {{features }}</div>
  </div>
</template>

<script>

export default {
    data(){
        return {
                features: [],
        }
    },
    methods: {
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
        this.features = this.generateRandomPoints(5, [8.94760, 125.54078, 8.94758, 125.54102]) 
        
    }
}
</script>

<style>

</style>