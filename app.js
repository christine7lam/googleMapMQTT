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

client.subscribe("demo_discovery");

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/client/index.html');
});

io.sockets.on('connection', function(socket) {
    client.on('message', function (topic, message) {
        console.log(message.toString());
        //client.end();
       io.sockets.emit('json', JSON.stringify(message.toString()));
    });
});

