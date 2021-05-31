//const axios = require('axios');

$(document).ready(function(){ //dont need
    // jQuery methods go here...
    $("button").click(function(){
        //console.log($(this).attr('id')[5]);
        sendFloor($(this).attr('id')[5]);
    });
    
    $("#deselect").click(function(){
        $("button").removeClass("active");
    })
}); 
/*
//send floor to backend, backend send mqtt msg to netpie
function sendFloor(floorNo){
    console.log(floorNo);
    axios.post('/localhost:3000', {
    floor: floorNo
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
*/

const username = "46ccb5f9-2b18-4b1c-836e-7f0976c4d748";
const pw = "Wd8QahSjWL8rg3bWXoeSvATZA3MhNf3x";
const userpw = username + ":" + pw
const encoded = btoa(userpw);

async function getNetpie() {
    var response = await fetch('https://api.netpie.io/v2/device/shadow/data', {
        method: 'GET',
        headers: {
            Authorization: "Device "+ userpw
        }
    });
    console.log(response);
    var data = await response.json();
    return data;
}

var timer = setInterval(updateDOM, 3000);

async function updateDOM() {
    var netpie = await getNetpie();
    updateButton(netpie);
    updateFloor(netpie);
    updatePerson(netpie);
}

function updateFloor(netpie){
    console.log('in updateFloor');
    document.getElementById("floor").innerHTML = netpie.data.currFl;
}

function updatePerson(netpie){
    console.log('in updatePerson');
    let val = `${netpie.data.currPers} / 4 persons`
    document.getElementById("peopleCount").innerHTML = val;
}

function updateButton(netpie) {
    console.log('in updateButton')
    // get from back/netpie res.data.liftButt
    console.log(netpie);
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
    console.log('showing items from database')
    updateDOM();
});
 
function redrawDOM() {
    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true
    }));
    document.getElementById("item-to-add").value = "";
    document.getElementById("name-to-add").value = "0";
    document.getElementById("price-to-add").value = "";
}



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