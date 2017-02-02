var mongoose = require('mongoose');
var addressSchema = require('../models/address').schema;

var locationSchema = new mongoose.Schema({
  address: addressSchema,
  gps: String
});

module.exports = mongoose.model('Location', locationSchema);
