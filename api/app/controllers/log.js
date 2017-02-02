
var Log = require('../models/log');

var ctrlLog = {};

ctrlLog.getAll = function(req, res) {
  var startDate = new Date(req.query.startDate);
  var endDate = new Date(req.query.endDate);

  var query = { 'date': { '$gte': startDate, '$lt': endDate } };
  if(req.query.type) {
    query.type = req.query.type
  }
  Log.find(query)
    .exec(function (err, logs) {
      if (err) return res.status(500).json(err);
      res.status(200).json(logs);
    });
};

module.exports = ctrlLog;