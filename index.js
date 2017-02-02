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

function generateRandomUserId() {
  return (Math.random() * 0xFFFFFF<<0).toString(16);
}

// Socket.io

io.on('connection', function(socket) {
  const userId = generateRandomUserId();
  users[userId] = socket;

  console.log(userId);

  socket.on('client_create_user', function(msg) {
    console.log('client_create_user');
    socket.emit('server_create_user', userId);
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

var server = http.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d.', server.address().port);
});

