var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var post = new Schema({
  poster: Object,
  content: String,
  likes: Array,
  comments: Array,
  createdAt: Date,
});

module.exports =  mongoose.model('post', post)
