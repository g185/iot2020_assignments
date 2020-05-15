const express = require('express');
const socket = require('socket.io');
var http = require('http');
var https = require('https');
var fs = require('fs');

var httpsOptions = {
    key: fs.readFileSync('/home/giuliano/Desktop/IOT/serverless-web-app/conf/key.pem'),
    cert: fs.readFileSync('/home/giuliano/Desktop/IOT/serverless-web-app/conf/cert.pem')
};


const app = express();

//static resources
app.use(express.static('public'));


http.createServer(app).listen(8888);
var server= https.createServer(httpsOptions, app).listen(4433);
//Aws Connection

var awsIot = require('aws-iot-device-sdk');
var device = awsIot.device({
   keyPath: "/home/giuliano/Desktop/IOT/cert/446f93cefd-private.pem.key",
  certPath: "/home/giuliano/Desktop/IOT/cert/446f93cefd-certificate.pem.crt",
    caPath: "/home/giuliano/Desktop/IOT/cert/root-CA.crt",
  clientId: "EnvironmentalStation_1",
      host: "a2z25wkbsy932x-ats.iot.us-east-1.amazonaws.com"
});

var io = socket(server);

io.on('connection', function(socket){
    console.log('connect');
    device.subscribe('topic');
    device.publish('topic', JSON.stringify({ connected: "true"}));

    socket.on('accelerometer', function(data){
        console.log(data);
        console.log('Sending message: ');
    device.publish('topic', JSON.stringify(data));
    })
});