var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// CORS
// https://www.html5rocks.com/en/tutorials/cors/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.send('<h1>Hello world</h1>');
});

var users = {};
var rooms = {};

function generateRandomUserId() {
  console.log('GENERATING RANDOM USER');
  return (Math.random() * 0xFFFFFF<<0).toString(16);
}

// Socket.io

io.on('connection', function(socket) {
  const userId = generateRandomUserId();
  users[userId] = socket;

  socket.on('client_create_user', function(msg) {
    const response = {
      user_id: userId
    };
    console.log('client_create_user');
    console.log(response);
    console.log('ALL USERS');
    for (var user in users) {
      console.log(user);
    }
    socket.emit('server_create_user', response);
  });

  socket.on('client_create_room', function(msg) {
    // TODO: create the room
    console.log('client_create_room');
    console.log(msg);
    socket.emit('server_create_room', msg);
  });

  socket.on('disconnect', function() {
    console.log('user ' + userId + ' disconnected');
  });
});

var server = http.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d.', server.address().port);
});
