var async = require('async');
var Order = require('../models/order');
var Project = require('../models/project');
var moment = require('moment');

var ctrlOrder = {};

ctrlOrder.get = function(req, res) {
  Order.findOne({ '_id': req.query.id })
    .populate('silo supplier')
    .exec(function (err, order) {
      if (err) return res.status(500).json(err);
      res.status(200).json(order);
    });
};

ctrlOrder.post = function(req, res) {
  req.body.companyId = req.session.companyId;
  req.body.number = req.body.silo.serial + '-' + moment().format('DD/MM/YY-Hmmss');

  async.waterfall([
    function(done) {
      Order.create(req.body, function (err, order) {
        done(err, order);
      });
    },
    function(order, done) {
      Project.addOrderCurrentSilo(req.body.companyId, req.body.silo._id, order, done)
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

ctrlOrder.put = function(req, res) {
  Order.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, order) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(order);
    });
};

ctrlOrder.getAll = function(req, res) {
  Order.find({'companyId': req.session.companyId})
    .populate('silo supplier')
    .exec(function (err, orders) {
      if (err) return res.status(500).json(err);
      res.status(200).json(orders);
    });
};

ctrlOrder.getAllSupplier = function(req, res) {
  Order.find({'companyId': req.session.companyId, 'supplier': req.params.id})
    .populate('silo supplier')
    .exec(function (err, orders) {
      if (err) return res.status(500).json(err);
      res.status(200).json(orders);
    });
};

ctrlOrder.delete = function(req, res) {
  Order.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, order) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlOrder;