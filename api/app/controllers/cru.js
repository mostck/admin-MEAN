
var Cru = require('../models/cru');

var ctrlCru = {};

ctrlCru.get = function(req, res) {
  Cru.findOne({ '_id': req.query.id })
    .exec(function (err, record) {
      if (err) return res.status(500).json(err);
      res.status(200).json(record);
    });
};

ctrlCru.post = function(req, res) {
  req.body.companyId = req.session.companyId;

  Cru.create(req.body, function (err, record) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(record);
    });
};

ctrlCru.put = function(req, res) {
  Cru.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, record) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(record);
    });
};

ctrlCru.getAll = function(req, res) {
  Cru.find({companyId: req.session.companyId})
    .exec(function (err, records) {
      if (err) return res.status(500).json(err);
      res.status(200).json(records);
    });
};

ctrlCru.getAllForDevice = function(req, res) {
  Cru.find({companyId: req.session.companyId, deviceId: req.params.deviceId})
    .exec(function (err, records) {
      if (err) return res.status(500).json(err);
      res.status(200).json(records);
    });
};


ctrlCru.delete = function(req, res) {
  Cru.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, record) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlCru;