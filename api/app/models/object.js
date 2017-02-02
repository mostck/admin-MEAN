var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = require('../models/location').schema;

var objectSchema = new mongoose.Schema({
  name: String,
  companyId: Schema.Types.ObjectId,
  location: locationSchema,
  startDate: Date,
  endDate: Date,
  possibleDeliveryTime: {
    daysOfWeek: [Number],
    holiday: Boolean
  },
  сomment: String,

  silos: [
    {
      startDate: Date,
      endDate: Date,
      supplier: { type: Schema.Types.ObjectId, ref: 'User' },
      silo: { type: Schema.Types.ObjectId, ref: 'Silo' },
      orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
      heaters: [
        {
          startOperationHours: Number,
          endOperationHours: Number,
          startDate: Date,
          endDate: Date,
          heater: { type: Schema.Types.ObjectId, ref: 'Heater' }
        }
      ]
    }
  ],
  numberSilos: {type: Number, default: 0},
  numberHeaters: {type: Number, default: 0}
});

module.exports = mongoose.model('Object', objectSchema);
