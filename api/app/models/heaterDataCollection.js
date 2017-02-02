var mongoose = require('mongoose');

var heaterDataCollectionSchema = new mongoose.Schema({
  // object: String,
  iccid: String,
  mcuid: String,
  gnss: String,
  lat: String,
  lon: String,
  date: String,
  time: String,
  U220: String,
  U24: String,
  relay: String
});

module.exports = mongoose.model('HeaterDataCollection', heaterDataCollectionSchema);
