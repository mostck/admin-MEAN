var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressSchema = require('../models/address').schema;

var customerSchema = new mongoose.Schema({
  name: String,
  companyId: Schema.Types.ObjectId,
  permissions: Object,
  address: addressSchema
});

module.exports = mongoose.model('Customer', customerSchema);
