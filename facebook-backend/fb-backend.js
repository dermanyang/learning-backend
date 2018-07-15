"use strict";

//Requisites
var fs = require('fs');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

var TokenSchema = require('./models/tokenModel')
var User = require('./models/userModel')
var Post = require('./models/postModel')

//Intialize Express
var app = express();
app.use(logger('dev'));

if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});

//Connect MongoDB Database
mongoose.connect(process.env.MONGODB_URI);

console.log('Express started. Listening on port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);

//hbs
app.engine('hbs', exphbs({
  'extname': 'hbs'
}));
app.set('view engine', 'hbs');

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


//    *** ROUTES ***      //

//Landing Page Tester
app.get('/', function(req, res) {
  res.render('index');
});

//registration Page Tester
app.get('/api/users/register', function(req, res) {
  res.render('registration')
});

//login Page Tester
app.get('/api/users/login', function(req, res) {
  res.render('login')
});

//  register
app.post('/api/users/register', function(req, res){
  // create the new user (register)
  console.log(req.body);
  var newUser = new User({
    fname: req.body.fname,
    lname:req.body.lname,
    email: req.body.email,
    password: req.body.password
  });
  //save newUser to mongo
  newUser.save({}, function(error, results){
    if (error) {
    res.json("invalid input", error);
    } else {
    // res.json(results);
    console.log("registration success");
    res.render('login')
    // res.json("Successfully Registered!");

    }
  });
});

// login
app.post('/api/users/login', function(req, res) {
  //create token
  var dateId = new Date()
  dateId.toString()
  var token = req.body.email + dateId

  User.findOne({email: req.body.email}, function(err, result) {
    if (err) {
      res.json("Sorry, your email hasn't been registered yet.");
      console.log("hasn't been registered yet");
    } else {
      console.log(result.password, req.body.password)
      if (result.password === req.body.password) {
            console.log("req body email", req.body.email);
            var newToken = new TokenSchema({
              userId: getEmailId(req.body.email),
              token: token,
              createdAt: new Date()
            });

            //save token to mongo
            newToken.save({}, function(error, results){
              if (error) {
                res.json("something wrong with email", error);
              } else {
              // res.json(results);
                res.render('postLogin', {
                  token: token
                });
                console.log("token login success");
                }
            });
      } else {
        console.log("Incorrect password!");
      }
    }
  });
});


//Logout and delete object from token collection
app.get('/api/users/logout/', function(req, res) {
   TokenSchema.findOneAndRemove({token: req.query.token}, function(error, success){
      if (error){
        console.log("something terrible went wrong with the log out....");
      }
      else {
        //delete id
        console.log("successfully logged out");
      }
    });
});

//routes to /api/posts
app.get('/api/posts/', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    Post.find({}, function( error, result) {
      if(error) {
        console.log('error with finding posts');
      }
      res.send(result);
    });
});

//valid token --> /api/posts/
app.post('/api/posts/', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    //token validated
    User.findOne({token: req.params.token}, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        console.log("success! ", res)
        var poster = res
      }
    });

    var newPost = new post({
      poster: poster,
      content: req.body.contents,
      likes: [],
      comments: [],
      createdAt: new Date()
    });

    newPost.save(function(error, results) {
      if(error) {
        console.log('error!');
      } else {
        console.log('success');
      }
    });

    res.json()
});

//routes to /api/posts/:page
app.get('/api/posts/:page', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    //token validated
    var page = req.params.page
    Post.find({}, function( error, result) {
      if(error) {
        console.log('error with finding posts');
      }
      res.send(result[(page*10): (page*10) + 10]);
    });
});

//valid token --> get: /api/posts/comments/:post_id
app.get('/api/posts/comments/:post_id', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    //token validated
    var postId = req.params.post_id
    Post.findOne({_id:post_id}, function( error, result) {
      if(error) {
        console.log('error with finding posts');
      } else {
        var comments = result.comments;
        
      }
    });
    res.json()
});

//valid token --> post: /api/posts/comments/:post_id
app.post('/api/posts/comments/:post_id', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    //token validated
    res.json()
});

//valid token --> post: /api/posts/likes/:post_id
app.post('/api/posts/likes/:post_id', function(req, res) {
  if(!validToken(req.params.token)) {
    //if invalid token
    console.log("comething went wrong with the token");
    res.json("Connection timeout");
    }
    //token validated
    res.json()
});


//      *** HELPER FUNCTIONS ***      //
//retrieves user id given user email
function getEmailId(thisEmail){
  User.findOne({email : thisEmail}, function(err, res){
    if(err){
      console.log("Sorry, this email isn't in our records!");
      console.log("email not found");
    }
    else{
      console.log("found email id!");
      console.log(res);
      return res.id;
    }
  });
}

//checks whether given token is valid.
function validToken(token){
  TokenSchema.findOne({token: token}, function(err, res) {
    if (err){
      console.log("something went horribly wrong with token validation");
      return false;
    }
    else{
      console.log('valid token');
      return true;
    }
  });
}
