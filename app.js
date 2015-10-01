/**
 * Created by heipakchristine on 9/26/15.
 */
var express = require('express');
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

//mqtt
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://208.50.140.200:8080');

client.subscribe("demo_discovery/#");
client.subscribe("discovery_events/#");

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/client/index.html');
});

client.on('message', function (topic, message) {
    //console.log(message.toString());
    //client.end();

    /** Retrieveing MQTT JSON here ***/
    var results = {
        topic: topic,
        msgString: JSON.stringify(message.toString())
    }
   io.sockets.emit('json', results);

});

/** Pushing out Fraud Commands here ***/
io.sockets.on('connection', function(socket) {
    socket.on('fraudcommands', function(data) {  // console.log(JSON.parse(data).events[0].assetKey);
        var dataJson = JSON.parse(data);
        var fraudTop1 = "demo_cmd/"+dataJson.events[0].assetKey;
        var fraudTop2 = "demo_cmd/"+dataJson.events[1].assetKey;
        //client.on('message', function (topic, message) {
            client.publish(fraudTop1, data);
            client.publish(fraudTop2, data);
            //client.end();
        //});
    });
});

