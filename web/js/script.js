//const axios = require('axios');


$(document).ready(function(){ //dont need
    // jQuery methods go here...
    $("button").click(function(){
        //console.log($(this).attr('id')[5]);
        $(this).addClass("active")
        sendFloor($(this).attr('id')[5]);
    });
    
    $("#deselect").click(function(){
        $("button").removeClass("active");
    })
}); 
// MQTT
/*
const mqtt_server = "mqtt.netpie.io";
const mqtt_port = 1883;
const mqtt_client = "46ccb5f9-2b18-4b1c-836e-7f0976c4d748";
const mqtt_username = "Wd8QahSjWL8rg3bWXoeSvATZA3MhNf3x";
const mqtt_password = "RKRAgOQUktN6ss0HP2kWqw81UpJWG*F9";

const client = new Paho.MQTT.Client(mqtt_server, 443, mqtt_client);
client.onConnectionLost = onConnectionLost;
var options = {
    timeout: 5,
    keepAliveInterval: 30,
    useSSL: true,
    userName : mqtt_username,
    password : mqtt_password,  
    onSuccess: onConnect,
    onFailure: doFail,
}

client.connect(options);

function onConnect() {
    console.log('connected to mqtt');
    client.subscribe("@msg/floor", 1);
}
function doFail(e){
    console.log('mqtt failed', e);
}
function onConnectionLost(responseObject){
    if(responseObject.errorCode!== 0){
        console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}
*/
// END MQTT
//send floor to backend, backend send mqtt msg to netpie

const username = "46ccb5f9-2b18-4b1c-836e-7f0976c4d748";
const pw = "Wd8QahSjWL8rg3bWXoeSvATZA3MhNf3x";
const userpw = username + ":" + pw
const encoded = btoa(userpw);

function sendFloor(floorNo){
    console.log(floorNo);
    var body = floorNo.toString();
    /*
    var message = new Paho.MQTT.Message(floorstr);
    message.destinationName = "@msg/floor";
    message.qos = 2;
    client.send(message);
    */
    
    axios.request({
        method: 'put',
        data: body,
        url: 'https://api.netpie.io/v2/device/message/floor',
        headers: {
            'Authorization' : "Device "+ userpw,
            'Content-Type' : 'text/plain'
        }
    })
    .then((response) => {
        console.log('in send floor')
        console.log(response);
    })
    .catch((error)=> {
        console.log(error);
    });
    
}



async function getNetpie() {
    /*
    var response = await fetch('https://api.netpie.io/v2/device/shadow/data', {
        method: 'GET',
        headers: {
            Authorization: "Device "+ userpw
        }
    });
    console.log(response);
    var data = await response.json();
    */
    try {
        const response = await axios.get('https://api.netpie.io/v2/device/shadow/data',{
            headers: {
                Authorization: "Device "+ userpw
            }
        });
        //console.log("res: ", response.data);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}

var timer = setInterval(updateDOM, 200);

async function updateDOM() {
    var netpie = await getNetpie();
    updateButton(netpie);
    updateFloor(netpie);
    updatePerson(netpie);
    updateDir(netpie);
    updateDoor(netpie);
}

function updateDir(netpie){
    if(netpie.data.dir===1){
        jQuery("#direction").removeClass("fa-caret-down")
        jQuery("#direction").addClass("fa-caret-up")
        console.log('up');
    }
    else{
        jQuery("#direction").removeClass("fa-caret-up")
        jQuery("#direction").addClass("fa-caret-down")
        console.log('down');
    }
}

function updateDoor(netpie){
    if(netpie.data.dooropen===1){
        document.getElementById("door").innerHTML = "Door Open";
    }
    else{
        document.getElementById("door").innerHTML = "";
    }
}

function updateFloor(netpie){
    //console.log('in updateFloor');
    document.getElementById("curFloor").innerHTML = netpie.data.currFl;
}

function updatePerson(netpie){
    //console.log('in updatePerson');
    jQuery("#peopleCount").css("color","");
    let val = `${netpie.data.currPers} / 4 persons`
    document.getElementById("peopleCount").innerHTML = val;
    switch(netpie.data.currPers){
        case 0:

        case 1:
            jQuery("#peopleCount").css("color","#3d9215"); //green
            break;
        case 2:
            jQuery("#peopleCount").css("color","#F2DF0C"); //yellow
            break;
        case 3:
            jQuery("#peopleCount").css("color","#a0540c"); //orange
            break;
        default:
            jQuery("#peopleCount").css("color","#a01d0c"); //red
            break;    
    }
}

function updateButton(netpie) {
    //console.log('in updateButton')
    // get from back/netpie res.data.liftButt
    //console.log(netpie);
    var liftButton = netpie.data.liftButt;
    for(var i=1;i<=5;i++){
        var x = `#floor${i}`;
        if(liftButton[i-1] === '1'){ // if the button should be on
            jQuery(x).addClass("active");
        }
        else{
            jQuery(x).removeClass("active");
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    updateDOM();
});
/*
function redrawDOM() {
    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
    document.getElementById("item-to-add").value = "";
    document.getElementById("name-to-add").value = "0";
    document.getElementById("price-to-add").value = "";
}
*/



test = () => {
    console.log(123);
    fetch('https://api.netpie.io/v2/device/shadow/data', {
        method: 'GET',
        headers: {
            Authorization: "Device "+ userpw
        }
    })
        .then(response => {
            console.log('here1')
            return response.json();
        })
        .then(res => {
            console.log(res.data.liftButt);
            console.log('here2');
        })
        .catch(err=>{
            console.log(err);
        })
}