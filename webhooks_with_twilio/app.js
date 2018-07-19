//require necessary modules
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars');
var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
var Message = require('./models').Message;
//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})

mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})

mongoose.connect(process.env.MONGODB_URI);

//setup application configurations
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//ROUTES GO HERE
mongoose.connection.on('connected', function(){
  console.log('successfully connceted to mongodb');
})

//      **handle text**     //


app.get('/', function(req, res){
  Message.find(function(err, messages){
    res.render('viewmessages', {
      messages: messages
    })
  })
});

//asdl

app.post('/handletext', function(req, res){
  console.log(req.body)
  client.messages.create({
    to: req.body.From,
    from: "+14243060969",
    body: "handshake",
  })

  var newMessage = new Message({
    from: req.body.From,
    body: req.body.Body
  });

  newMessage.save(function(){
    console.log('save message');
    res.end();
  });

});



//start up our server
var port = process.env.PORT || 3000

app.listen(port)
