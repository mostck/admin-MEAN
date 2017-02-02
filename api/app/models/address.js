var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  country: String,
  town: String,
  streetNr: String,
  additionalLine: String,
  zip: String
});

module.exports = mongoose.model('Address', addressSchema);
