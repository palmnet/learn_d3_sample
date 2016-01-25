var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3 = require("d3");
var session = require('express-session'); 
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
app.get('/top10/:name', function(req, res){
  var name = req.params.name;
  client2.zrevrange(name, 0, 10, 'withscores', function(err, members) {
    if(err) {
      return;
    }
    var results = [];
    for(var i=0; i<members.length; i+=2) {
      var row = {count: members[i+1]};
      row[name] = members[i];
      results.push(row);
    }
    res.json(results);
  });
});

// SessionController start
function SessionController() {
  this.ch_spark = redis.createClient();
  this.ch_alarm = redis.createClient();
  this.redis_cli = redis.createClient();
};

SessionController.prototype.subscribe = function(socket) {
  console.log("subscribe:" + socket.id);

  // subscribe
  this.ch_spark.subscribe('spark-alarm');
  this.ch_alarm.subscribe('send-alarm');

  // raw alarm 
  var current = this;
  this.ch_alarm.on("message", function (channel, message) {
    console.log(channel + ":" + message);

    var parsed = JSON.parse(message)
    current.redis_cli.zadd("alarms", parsed.epoch, message);
    socket.emit("send-alarm", parsed, function(data) {
    });

    current.redis_cli.zcount("alarms", "-inf", "+inf", function(err, total) {
      socket.emit("total-alarms", total, function(data) {
      });
    });
  });

  // spark summary alarm
  this.ch_spark.on("message", function (channel, message) {
    console.log(channel + ":" + message);
    socket.emit("publish", message, function(data) {
      console.log('publish: ' + data);
    });
  });
};

SessionController.prototype.unsubscribe = function() {
  this.ch_spark.unsubscribe('spark-alarm');
  this.ch_alarm.unsubscribe('send-alarm');
};

SessionController.prototype.destroy = function() {
  if (this.ch_spark)  { this.ch_spark.quit(); }
  if (this.ch_alarm)  { this.ch_spark.quit(); }
  if (this.redis_cli) { this.redis_cli.quit();}
};
// SessionController end 

// io.socket
io.sockets.on('connection', function(socket) {
  console.log(socket.id);
  var session = socket.session;
  if(session == null) {
    session = new SessionController();
    session.subscribe(socket);
    socket.session = session;
  }

  socket.on('disconnect', function () {
    session.unsubscribe();
    session.destroy();
  });
});

// express boot
http.listen(3000, function(){
  console.log('listening on *:3000');
});

