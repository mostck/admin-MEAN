
var Object = require('../models/object');

var ctrlObject = {};

ctrlObject.get = function(req, res) {
  Object.findOne({ '_id': req.query.id })
    .exec(function (err, object) {
      if (err) return res.status(500).json(err);
      res.status(200).json(object);
    });
};

ctrlObject.post = function(req, res) {
  req.body.companyId = req.session.companyId;

  Object.create(req.body, function (err, object) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(object);
    });
};

ctrlObject.put = function(req, res) {
  Object.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, object) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(object);
    });
};

ctrlObject.getAll = function(req, res) {
  Object.find({companyId: req.session.companyId})
    .exec(function (err, objects) {
      if (err) return res.status(500).json(err);
      res.status(200).json(objects);
    });
};

ctrlObject.delete = function(req, res) {
  Object.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, object) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlObject;