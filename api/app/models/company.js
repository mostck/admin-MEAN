var mongoose = require('mongoose');
var addressSchema = require('../models/address').schema;

var companySchema = new mongoose.Schema({
  name: String,
  email: String,
  address: addressSchema,
  phone: String,
  logo: String,
  officeTime: {
    daysOfWeek: [Number],
    startTime: String,
    endTime: String
  },
  reminderTime: String,
  reminderProjTime: String,
  periodicServiceTime: Number,
  operationsServiceTime: Number
});

module.exports = mongoose.model('Company', companySchema);
