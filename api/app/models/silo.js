var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = require('../models/location').schema;

var siloSchema = new mongoose.Schema({
  serial: { type: String, unique: true },
  serialNr: { type: String },
  companyId: Schema.Types.ObjectId,
  maxLoad: Number,
  fillingLevel: Number,
  changeFillingLevelDate: Date,
  estimateTime: Number,
  location: locationSchema,
  reminderStatus: { type: Number, default: 0 }
});

module.exports = mongoose.model('Silo', siloSchema);
