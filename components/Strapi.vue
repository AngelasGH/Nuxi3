<template>
    <div>
      <ul v-if="!pending">
        <li v-for="restaurant in restaurants.data" :key="restaurant.id">
          {{ restaurant.attributes.counted_vehicle}}
          <span> {{getVehicleClassName(restaurant.attributes.class_id)}} </span>
          <button @click="$router.push(`${$route.path}/restaurant/${restaurant.id}`)">Edit</button>
          <button @click="deleteRestaurant(restaurant.id)">Delete</button>
        </li>
      </ul>
      <div v-else>Loading...</div>
      <nuxt-link :to="`${$route.path}/restaurant/create`">Create</nuxt-link>
    </div>
  </template>
  
  <script>
  
  export default {
   
    data() {
      return {
        pending: true,
        restaurants: {},
        error: {},
  

      }
    },
    async mounted() {
    
      const { findOne, find, delete: remove } = useStrapi()
      const { data, pending, refresh, error } = await useAsyncData(
        'detected-vehicles',
        () => find('detected-vehicles?_populate=class_id')
      )
      this.restaurants = data
      this.pending = pending
      this.error = error

    },
    methods: {
      async deleteRestaurant(Id) {
        await remove("detected-vehicles", Id);
        //refresh
      },
      async getVehicleClassName(classId){
        const { find } = useStrapi();
        const { data } = await useAsyncData('vehicle-classes', () => find('vehicle-classes',{ id: classId }))
        return data.name;
      }
    }
  }
  </script>