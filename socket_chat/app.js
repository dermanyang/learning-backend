var express = require('express');
var path = require('path');
var morgan = require('morgan');
var exphbs = require('express-handlebars');
var app = require('express')();

//socket.io things
var server = require('http').Server(app);
var io = require('socket.io')(server);

//event listener
io.on('connection', function(socket){
  socket.on('username', function(user){
    socket.username = user;
    socket.emit('serverMessage', 'Welcome, ' + user + '!');
    socket.broadcast.emit('joinedRoom', socket.username)
  });
  socket.on('message', function(msg){
    if (!socket.username){
      socket.emit('serverMessage', 'please enter a username');
      return;
    } else {
    console.log(msg);
    io.emit('serverMessage', socket.username + ': ' + msg)
  }
  })

  console.log('client has connected');
});
//asdij


// Set View Engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// Static assetss
app.use(express.static(path.join(__dirname, 'public')));

// Logging
app.use(morgan('combined'));

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3001;

server.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});
