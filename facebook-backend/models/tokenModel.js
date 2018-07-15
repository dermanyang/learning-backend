var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    userId: String,
    token: String,
    createdAt: Date
});
module.exports =  mongoose.model('Token', TokenSchema)
