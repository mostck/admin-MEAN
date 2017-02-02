
var Customer = require('../models/customer');
var User = require('../models/user');

var ctrlCustomer = {};

ctrlCustomer.post = function(req, res) {
  req.body.companyId = req.session.companyId;
  Customer.create(req.body, function (err, customer) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(customer);
  });
};

ctrlCustomer.put = function(req, res) {
  Customer.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, customer) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(customer);
    });
};

ctrlCustomer.get = function(req, res) {
  Customer.findOne({ '_id': req.query.id })
    .exec(function (err, customer) {
      if (err) return res.status(500).json(err);
      res.status(200).json(customer);
    });
};

ctrlCustomer.getAll = function(req, res) {
  Customer.find({ 'companyId': req.session.companyId })
    .exec(function (err, customers) {
      if (err) return res.status(500).json(err);
      res.status(200).json(customers);
    });
};

ctrlCustomer.delete = function(req, res) {
  Customer.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, customer) {
      if (err) return res.status(500).json(err);
      User.remove({'customer': req.params.id })
        .exec( function (err) {
          if (err) return res.status(500).json(err);
          return res.status(200).json();
        })
    });
};

module.exports = ctrlCustomer;