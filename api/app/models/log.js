var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new mongoose.Schema({
  url: String,
  method: String,
  name: String,
  type: String,
  date: { type: Date, default: Date.now },
  body: Object
});

module.exports = mongoose.model('Log', logSchema);
