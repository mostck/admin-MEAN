var async = require('async');
var Company = require('../models/company');
var User = require('../models/user');
var Customer = require('../models/customer');
var Project = require('../models/project');
var Heater = require('../models/heater');
var Silo = require('../models/silo');

var ctrlCompany = {};


ctrlCompany.post = function(req, res) {
  Company.create(req.body, function (err, company) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(company);
  });
};

ctrlCompany.put = function(req, res) {
  Company.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, company) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(company);
    });
};

ctrlCompany.get = function(req, res) {
  Company.findOne({ '_id': req.session.companyId })
    .exec(function (err, company) {
      if (err) return res.status(500).json(err);
      res.status(200).json(company);
    });
};

ctrlCompany.getAll = function(req, res) {
  Company.find({})
    .exec(function (err, companies) {
      if (err) return res.status(500).json(err);
      res.status(200).json(companies);
    });
};

ctrlCompany.delete = function(req, res) {
  async.waterfall([
      function (done) {
        Customer.remove({'companyId': req.params.id })
          .exec( function (err) {
            done(err)
          })
      },
      function (done) {
        User.remove({'companyId': req.params.id })
          .exec( function (err) {
            done(err)
          })
      },
      function (done) {
        Project.remove({'companyId': req.params.id })
          .exec( function (err) {
            done(err)
          })
      },
      function (done) {
        Heater.remove({'companyId': req.params.id })
          .exec( function (err) {
            done(err)
          })
      },
      function (done) {
        Silo.remove({'companyId': req.params.id })
          .exec( function (err) {
            done(err)
          })
      },
      function (done) {
        Company.remove({ '_id': req.params.id })
          .exec( function (err) {
            done(err)
          });
      }],
    function(err) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlCompany;