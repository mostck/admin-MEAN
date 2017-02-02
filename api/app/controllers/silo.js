var async = require('async');
var moment = require('moment');
var mailer = require('../lib/mailer');
var config = require('../config/index');
var Order = require('../models/order');
var Silo = require('../models/silo');
var Project = require('../models/project');
var Company = require('../models/company');
var Cru = require('../models/cru');

var ctrlSilo = {};

ctrlSilo.get = function(req, res) {
  async.waterfall([
    function(done) {
      Silo.findOne({ '_id': req.query.id })
        .exec(function (err, silo) {
          if (err) return res.status(500).json(err);
          done(err, silo.toObject());
        });
    },
    function(silo, done) {
      Project.findCurrentSilo(req.session.companyId, req.query.id, silo, done);
    },
    function(silo, done) {
      Project.find({ 'companyId': req.session.companyId, 'objects.silos.silo': req.query.id })
        .exec(function (err, projects) {
          if (err) return res.status(500).json(err);
          silo.projects = projects;
          done(err, silo);
        });
    },
    function(silo, done) {
      Cru.find({ 'companyId': req.session.companyId, 'deviceId': req.query.id })
        .exec(function (err, records) {
          if (err) return res.status(500).json(err);
          silo.logbook = records;
          done(err, silo);
        });
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

ctrlSilo.post = function(req, res) {
  req.body.companyId = req.session.companyId;

  Silo.create(req.body, function (err, silo) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(silo);
  });
};

ctrlSilo.put = function(req, res) {
  Silo.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec( function (err, silo) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(silo);
    });
};

ctrlSilo.getAll = function(req, res) {
  async.waterfall([
    function(done) {
      Silo.find({ 'companyId': req.session.companyId })
        .exec( function (err, silos) {
          if (err) return res.status(500).json(err);
          done(err, silos);
        });
      
    },
    function (silos, done) {
      async.map( silos, function(silo, done) {
        silo = silo.toObject();
        Project.find({
          companyId: req.session.companyId,
          'objects.silos.silo': silo._id
        })
          .exec(function (err, projects) {
            if (err) return res.status(500).json(err);
            silo.projects = projects;
            Project.findCurrentSilo(req.session.companyId, silo._id, silo, done);
          });
        Cru.find({
          companyId: req.session.companyId,
          deviceId: silo._id,
          reason: 'planned_service'
        })
          .exec(function (err, records) {
            if (err) return res.status(500).json(err);
            silo.logbook = records;
          });
      }, done);
    }
    ], function (err, done) {
      if (err) return res.status(500).json(err);
      res.status(200).json(done);
    })
};

ctrlSilo.getAllCurrent = function(req, res) {
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  Project.find(
    {
      'companyId': req.session.companyId,
      'objects.silos.startDate': { '$lt': endDate },
      'objects.silos.endDate': { '$gte': startDate }
    })
    .populate('objects.silos.silo')
    .populate('objects.silos.supplier')
    .exec(function (err, projects) {
      if (err) return res.status(500).json(err);
      var silos = [];
      projects.forEach(function (project) {
        project.objects.forEach(function (object) {
          object.silos.forEach(function (silo) {
            if(moment(silo.startDate) < moment() && moment(silo.endDate) > moment() && silo.supplier) {
              var data = silo.silo.toObject();
              data.supplier = silo.supplier;
              silos.push(data);
            }
          });
        });
      });
      return res.status(200).json(silos);
    });
};

ctrlSilo.delete = function(req, res) {
  Silo.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, silo) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

ctrlSilo.changeFillingLevel = function(req, res) {
  Silo.findOne({ '_id': req.body.id })
    .exec( function (err, silo) {
      if (err) return res.status(500).json(err);

      var changeFillingLevelDate = moment();

      if(silo.changeFillingLevelDate && silo.fillingLevel && silo.fillingLevel > req.body.fillingLevel) {
        silo.estimateTime = Math.round(req.body.fillingLevel/(silo.fillingLevel - req.body.fillingLevel)*(changeFillingLevelDate - silo.changeFillingLevelDate));
      } else {
        silo.estimateTime = null;
      }

      if(req.body.fillingLevel / silo.maxLoad * 100 > 50){
        silo.reminderStatus = 0;
      }

      silo.fillingLevel = req.body.fillingLevel;
      silo.changeFillingLevelDate = changeFillingLevelDate;

      silo.save(function(err, _silo) {
        if (err) return res.status(500).json(err);
        return res.status(200).json(_silo);
      });
    });
};

ctrlSilo.reminder = function(req, res) {
  async.waterfall([
    function(done) {
      Silo.findOne({ '_id': req.body.id })
        .exec( function(err, silo) {
          if (!silo) {
            return res.status(500).json('not found!');
          }

          done(err, silo);
        });
    },
    function(silo, done) {
      Project.findCurrentSilo(req.session.companyId, req.body.id, silo, done);
    },
    function(silo, done) {
      var object = silo.object ? silo.object : {};
      var address = object && object.location && object.location.address ? object.location.address : {};
      var address = object && object.location && object.location.address ? object.location.address :
        silo.location && silo.location.address ? silo.location.address : {};
      var estimateDate = req.body.estimateDate ? req.body.estimateDate : {};
      var possibleDeliveryTime = object && object.possibleDeliveryTime ? object.possibleDeliveryTime : {};
      var daysOfWeek = '';
      if(possibleDeliveryTime.daysOfWeek) {
        possibleDeliveryTime.daysOfWeek.forEach(function (id) {
          daysOfWeek = daysOfWeek + __("dayOfWeek." + config.daysOfWeek[id]) + ' ';
        });
      }

      var subject = __('email.remind_silo.subject');
      var text = __('email.remind_silo.text',
        {
          serial: silo.serial,
          fillingLevel: Math.round(req.body.percent * 100) / 100,
          address: __('address.country') + ': ' + (address.country ? address.country : '') + ' ' +
          __('address.town') + ': ' + (address.town ? address.town : '') + ' ' +
          __('address.streetNr') + ': ' + (address.streetNr ? address.streetNr : '') + ' ' +
          __('address.additionalLine') + ': ' + (address.additionalLine ? address.additionalLine : '') + ' ' +
          __('address.zip') + ': ' + (address.zip ? address.zip : ''),
          daysOfWeek: daysOfWeek,
          holiday: possibleDeliveryTime.holiday ? possibleDeliveryTime.holiday : '',
          сomment: object.сomment ? object.сomment : '',
          estimateDate: __('date.months') + ': ' + (estimateDate.months ? estimateDate.months : '0') + ' ' +
            __('date.days') + ': ' + (estimateDate.days ? estimateDate.days : '0') + ' ' +
            __('date.hours') + ': ' + (estimateDate.hours ? estimateDate.hours : '0') + ' ' +
            __('date.minutes') + ': ' + (estimateDate.minutes ? estimateDate.minutes : '0')
        });

      var doneMail = function (err, status) {
        if (err) return done(err);
        done(err, silo);
      };

      if(silo.supplier && silo.supplier.username && silo.reminderStatus == 0 && req.body.percent <= 50) {
        silo.reminderStatus = 1;
        mailer.sendMail(silo.supplier.username, subject, text, doneMail);
      } else if(silo.supplier && silo.supplier.username && silo.reminderStatus == 1 && req.body.percent <= 30) {
        silo.reminderStatus = 0;

        var order = {
          number: silo.serial + '-' + moment().format('DD/MM/YY-Hmmss'),
          companyId: req.session.companyId,
          supplier: silo.supplier,
          silo: silo,
          amountOfTons: silo.maxLoad
        };

        Order.create(order, function (err, _order) {
          if (err) return res.status(500).json(err);

          text = text + config.clientHost + 'supplier/order/' + _order._id;

          Project.addOrderCurrentSilo(req.session.companyId, silo._id, _order, function () {
            mailer.sendMail(silo.supplier.username, subject, text, doneMail);
          })
        });
      } else {
        done(null, silo);
      }
    },
    function(silo, done) {
      Silo.findOneAndUpdate({ '_id': silo._id }, { 'reminderStatus': silo.reminderStatus })
        .exec( function (err, _silo) {
          done(err, silo)
        });
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

module.exports = ctrlSilo;