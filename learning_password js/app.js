"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');


// Express setup
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var passwordCollection = require('./passwords.plain.json');

// MONGODB SETUP HERE
var mongoose= require('mongoose');
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);

// SESSION SETUP HERE


// PASSPORT LOCALSTRATEGY HERE
var passwords = require('./passwords.plain.json');
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('LocalStrategy', username, password);
    var users = passwords.passwords;
    users = users.filter(function(user) {
      return user.username === username &&
          user.password === password;
    });
    if (users.length === 0) {
      console.log('FAILURE');
      done(null, false);
    } else {
      console.log('SUCCESS', users[0]);
      done(null, users[0]);
    }
  }
));


// PASSPORT SERIALIZE/DESERIALIZE USER HERE HERE
passport.serializeUser(function(user, done) {
  console.log('SERIALIZE', user),
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  console.log(userId);
  console.log('DESERIALIZE');
  var users = passwords.passwords;
  for (var i = 0; i < users.length; i++) {
    if (users[i]._id === userId) {
      done(null, users[i]);
      return;
    }
  }
  done(null, false);
});

// PASSPORT MIDDLEWARE HERE
// var cookieSession = require('cookie-session');
// app.use(cookieSession({
//   keys: ['secret string'],
//   maxAge: 1000*60*2
// }));

var session = require('express-session');
app.use(passport.initialize());
// app.use(passport.session());
app.use(session( { secret: "abcdef"} ));

var MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'abcdef',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));


// YOUR ROUTES HERE
app.get('/', function(req, res) {
  console.log('req.session', req.session);
  console.log('req.user', req.user);
  if (!req.user){
    res.redirect('/login')
  }
  res.render('index', {
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = app;
