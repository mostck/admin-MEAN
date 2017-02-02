var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cruSchema = new Schema({
  deviceId: Schema.Types.ObjectId,
  companyId: Schema.Types.ObjectId,
  startDate: Date,
  endDate: Date,
  employees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  totalTime: Number,
  reason: {
    type: String,
    enum: [
      'assembly',
      'disassembly',
      'planned_service',
      'service_repair',
      'alarm'
    ]
  },
  comment: String,
  spareParts: [String]
});

module.exports = mongoose.model('CRU', cruSchema);
