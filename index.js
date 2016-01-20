var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3 = require("d3");
var redis = require("redis"),
  client1 = redis.createClient(),
  client2 = redis.createClient(),
  client3 = redis.createClient(),
  client4 = redis.createClient();

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('/japan', function(req, res){
    res.sendfile('japan.html');
});
app.get('/alarms', function(req, res){
    res.sendfile('alarms.html');
});

app.get('/map', function(req, res){
    res.sendfile('map.html');
});

app.get('/dashboard', function(req, res){
    res.sendfile('dashboard.html');
});

app.get('/area', function(req, res){
    res.sendfile('area.html');
});

app.get('/init_alarms', function(req, res){
  client2.zrevrange("alarms",0 ,10, function(err, data) {
    if(err) {
      return;
    }
    var parsed = data.map(function(elem) {
      return JSON.parse(elem)
    });
    res.json(parsed);
  });
});


client4.subscribe("send-alarm");
    
io.sockets.on('connection', function(socket) {
		socket.on('disconnect', function () {
			io.emit('user disconnected');
		});
  
    /*
    socket.emit('greeting', {message: 'hello'}, function (data) {
      console.log('result: ' + data);
    });

    client2.get("total-alarms", function(err, replies) {
      socket.emit("total-alarms", replies, function(data) {
        console.log("total-alarms-reply:" + data);
      });
    });

    socket.on('reply', function(data) {
      console.log('reply: ' + data);
    });
    */

    client4.on("message", function (channel, message) {
      var parsed = JSON.parse(message)
      socket.emit("send-alarm", parsed, function(data) {
      });

      var high = 100, low = 0;
      var val = Math.random() * (high - low) + low;

      socket.emit("publish", val, function(data) {
        console.log('publish: ' + data);
      });
    });

    /*
    client3.on("message", function (channel, message) {
      socket.emit("alarm", message, function(data) {
        console.log('alarm: ' + data);
      });
    });
    */
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

