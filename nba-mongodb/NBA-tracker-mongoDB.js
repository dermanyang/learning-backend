// Require express and create an express app (Part 2.1)
var express = require('express');
var app = express();

// Begin listening on port 3000
app.listen(3000, function(){
  console.log('Listening on port 3000');
});
// Require mongoose (Part 2.2)
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// Require and setup body-parser (Part 4.1)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Require the Player model (Part 2.3)
var Player = require('./model/player');

// Require the Roster model (Part 5.2)
var Roster = require('./model/roster')


// Ensure that there is a MONGODB_URI environment variable (source env.sh)
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}


mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});
// Establish mongoose connection to the mongoDB on mlab (Part 2.2)


/* =====================================
        WRITE ROUTES DOWN HERE
   ===================================== */

// (Part 3.1)
app.get('/', function(rec,res) {
  Player.find({}, function(error, results){
    if(error){
      console.log('error', error);
    }
    else{
      res.json(results)
    }
});
})


// (Part 4.2)

app.post('/addPlayer', function(req, res){
  var newPlayer = new Player({
    Name: req.body.Name,
    Points: req.body.Points,
    Rebounds: req.body.Rebounds,
    Assists: req.body.Assists,
  });
  newPlayer.save({}, function(error, results){
    if (error) {
    res.json("invalid input", error);
    } else {
    res.json(results);
    res.json("successfully added")
    }
  });
  Player.find({}, function(error, results){
    if(error){
      console.log('error', error);
    }
    else{
      res.send(results)
    }
  });
});


// (Part 5.3)
app.post('/addPlayerRoster', function(req, res){
  var newRoster = new Roster({
    Name: req.body.Name,
    JerseyNumber: req.body.JerseyNumber,
    Team: req.body.Team,
  });
  newRoster.save({}, function(error, results){
    if (error) {
    res.json("invalid input", error);
    } else {
    res.json(results);
    res.json("successfully added")
    }
  });
})

app.get('/:rosterid', function(req, res){
  Roster.findOne({_id:req.params.rosterid}, function(err1, res1){
      var rosterKeys = res1;
      Player.findOne({Name: rosterKeys.Name}, function(err2, res2){
        if (err1 || err2) console.log("error");
        else{
        var finalObj = {...res1, ...res2};
        console.log(
          {
          "Name": res1.Name,
          "Team": res1.Team,
          "JerseyNum": res1.JerseyNumber,
          "Points": res2.Points,
          "Assists": res2.Assists,
          "Rebounds": res2.Rebounds
        }
      );
      }
      })
  })
})


// (BONUS)



// Begin listening on port 3000 (Part 2.1)
