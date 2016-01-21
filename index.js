var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3 = require("d3");
var redis = require("redis"),
  redis_cli = redis.createClient(),
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
app.get('/top10pref', function(req, res){
  client2.zrevrange('pref', 0, 10, 'withscores', function(err, members) {
    if(err) {
      return;
    }
    var results = [];
    for(var i=0; i<members.length; i+=2) {
      var row = {pref: members[i], count: members[i+1]};
      results.push(row);
    }
    console.log(results);
    res.json(results);
  });
});



client3.subscribe("spark-alarm");
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
      redis_cli.zadd("alarms", parsed.epoch, message);
      socket.emit("send-alarm", parsed, function(data) {
      });
    });

    client3.on("message", function (channel, message) {
      socket.emit("publish", message, function(data) {
        console.log('publish: ' + data);
      });
    });
    client2.on("message", function (channel, message) {
      var json = JSON.parse(message);
      socket.emit("spark-bypref", json, function(data) {
      });
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

