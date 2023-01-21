// This file is executed once when the server is started
console.log("Setting up socket.io server ...")

// Setup a socket.io server on port 3001 that has CORS disabled (do not set this to port 3000 as port 3000 is where the nuxt dev server serves your nuxt application)
const io = require("socket.io")(3001, {
    cors: {
        // No CORS at all
        origin: '*',
    }
});

var i = 0;
// Broadcast "tick" event every second
/* Or do whatever you want with io ;)
setInterval(() => {
    i++;
    io.emit("tick", i);
}, 1000);
*/
console.log("socket.io server now sends 'tick' event with 'tickId' parameter every second ...")

// producer.js
/* import the readline file */
var readline = require('readline');
/* Importing the file system module. */
var fs = require('fs');
/* Importing the zeromq module. */
var zmq = require("zeromq");

/* Defining the file that will be read. */
var filename = "../assets/pos.txt";

/* Creating a socket of type `push`. */
//var sock = zmq.socket("push");

/* Binding the socket to the port 3000. */
//sock.bindSync("tcp://127.0.0.1:3000");
//console.log("Producer bound to port 3000");


/* Sending the file content to the consumer every 500 milliseconds.
   readFileSync
*/
async function processLineByLine(){

        const filestream = fs.createReadStream(filename);

        const rl = readline.createInterface ({
            input: filestream,
            crlfDelay: Infinity
        });
    
        for await(const line of rl) {
            console.log(`${line}`);
            io.send(line);
            await sleep(2000)
        }

        function sleep(ms){
            return new Promise(resolve=>{
                setTimeout(resolve,ms)
            })
        }
        
    }

    // async function processLineByLine(){

    //     //const file= fs.readFile(filename);

    //     // const rl = readline.createInterface ({
    //     //     input: filestream,
    //     //     crlfDelay: Infinity
    //     // });
    
    // //     for await(const line of rl) {
    // //         console.log(`${line}`);
    // //         io.send(line);
    // //         await sleep(1000)
    // //     }

    // //     function sleep(ms){
    // //         return new Promise(resolve=>{
    // //             setTimeout(resolve,ms)
    // //         })
    // //     }
    
    // fs.readFile(filename, 'utf8', function(err, data){
    //     io.send(data);
    //     // Display the file content
    //     console.log(data);
    // });
      

    // }




//connect to socketIO
io.on('connection', function(socket){
     console.log('a user connected');
     processLineByLine();
 })

//sock.on('message', processLineByLine)

// Since we are a serverMiddleware, we have to return a handler, even if this it does nothing
// export default function (req, res, next) {
//     next()
// }