const express = require('express')
//const mqtt = require('mqtt');
var cors = require('cors');


  

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    allowedHeaders: ['Origin', 'X-Requested-With','Content-Type', 'Authorization'],
};

const app = express();

app.use("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req,res) => {
    console.log('in post, reqbody= ', req.body.floor.toString());
    var floor = req.body.floor;
    client.pubish("@msg/floor", floor.toString());
    //sendFloor(floor.toString());
    res.send('ok');
});

app.listen(3000, () => console.log('server started'))

//

//publish("@msg/floor","5")

// var client  = mqtt.connect('mqtt://mqtt.netpie.io',{
//     clientId: mqtt_client,
//     username: mqtt_username
// });

/** TO DO LIST
 * press button and send @msg/floor, 1,2,3,4,5
 *     :button pressed -> front --REST--> back --mqtt--> netpie
 * update floor
 * update peopleCount
 * update button according to ShadowData
 *    1) front have "updateDOM" on interval --REST--> back
 *    2) inbackground: if netpie update --mqtt--> back
 *    3) back --REST--> front -> webpage
 */

// var topic = "@msg/led"
// client.on('connect', function () {
//     console.log('connected to mqtt');
//     //console.log(client);

//     client.subscribe("@msg/led", err => {
//         if(!err){
//             console.log('sub to led');
//             client.publish("@shadow/data/update", '{"data": {"led": false}}')
//         }
//     })
// });
/*
client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
})
*/

/*
// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
    // Set a response type of plain text for the response
    res.writeHead(200, {'Content-Type': 'text/plain'});

    // Send back a response and end the connection
    res.end('Hello World!\n');
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');
*/