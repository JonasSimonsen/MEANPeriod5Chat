var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageLogSchema = new Schema({
    time: Date,
    username: String,
    msg: String
});

module.exports = mongoose.model('MsgLog', MessageLogSchema);