var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3 = require("d3");
var redis = require("redis"),
  client1 = redis.createClient();
  client2 = redis.createClient();

app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('/japan', function(req, res){
    res.sendfile('japan.html');
});
app.get('/alarm', function(req, res){
    res.sendfile('alarm.html');
});




client1.subscribe("spark-alarm");
client1.on("message", function (channel, message) {
	client2.incr("total-alarms");
	client2.get("total-alarms", function(err, replies) {
    console.log(">>> channel " + channel + " message " + message + " size " + replies);
  });
});

io.sockets.on('connection', function(socket) {
		socket.on('disconnect', function () {
			io.emit('user disconnected');
      console.log('disconnected!');
		});
  
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

    client1.on("message", function (channel, message) {
      console.log("channel " + channel + " message " + message);

      client2.get("total-alarms", function(err, replies) {
        socket.emit("total-alarms", replies, function(data) {
          console.log("total-alarms-reply:" + data);
        });
      });
      socket.emit("publish", message, function(data) {
        console.log('publish: ' + data);
      });

    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


