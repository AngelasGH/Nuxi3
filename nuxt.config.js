// https://nuxt.com/docs/api/configuration/nuxt-config
export default({
   
    // serverMiddleware: [
    //   '@/serverMiddleware/socket-io-server' 
    // ],
    modules: [
      // socket.io module
      'nuxt-socket-io',
    ],
  
    // socket.io configuration
    io: {
      // we could have multiple sockets that we identify with names
      // one of these sockets may have set "default" to true
      sockets: [{
        default: true, // make this the default socket
        name: 'main', // give it a name that we can later use to choose this socket in the .vue file
        url: 'http://localhost:3001' // URL wherever your socket IO server runs
      }]
    },
  
})
