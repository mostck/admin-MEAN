var async = require('async');
var moment = require('moment');
var Log = require('../models/log');
var Heater = require('../models/heater');
var Project = require('../models/project');
var HeaterDataCollection = require('../models/heaterDataCollection');
var Company = require('../models/company');
var Cru = require('../models/cru');

var ctrlHeater = {};

ctrlHeater.postDataCollection = function(req, res) {
  Log.create({ url: req.url, method: req.method, name: req.body.iccid, type: 'heater', body: req.body });
  async.waterfall([
      function (done) {
        HeaterDataCollection.findOneAndUpdate({ 'iccid': req.body.iccid }, req.body, { upsert:true })
          .exec( function(err, doc){
            done(err, doc);
          });
      },
      function (doc, done) {
        Heater.findOne({ 'serialNr': req.body.iccid })
          .exec( function(err, heater) {
            done(err, heater);
          });
      },
      function (heater, done) {
        Company.findOne({'_id': heater.companyId})
          .exec( function(err, company) {
            done(err, company, heater);
          });
      },
      function (company, heater, done) {
        if(req.body.alarm && req.body.alarm == true && moment() - moment(heater.alertDate) > moment.duration(company.reminderTime).as('ms')) {
          Heater.sendAlert(heater, function(err, done) {
            if (err) return res.end();
            heater.alertDate = new Date();
            heater.save(function (err, _heater) {
              return done(err, _heater);
            });
          })
        } else if (heater.operationsServiceStatus != 1 && moment.duration(company.operationsServiceTime, 'hours').valueOf() < req.body.time) {
          Heater.sendService(heater, 'operations', function(err, done) {
            if (err) return res.end();
            heater.operationsServiceStatus = 1;
            heater.save(function (err, _heater) {
              return done(err, _heater);
            });
          })
        } else if (heater.periodicServiceStatus != 1 && moment.duration(company.periodicServiceTime, 'hours').valueOf() < req.body.time) {
          Heater.sendService(heater, 'periodic', function(err, done) {
            if (err) return res.end();
            heater.periodicServiceStatus = 1;
            heater.save(function (err, _heater) {
              return done(err, _heater);
            });
          })
        } else {
          return done(null, null);
        }
      }],
    function(err, done) {
      return res.end();
    });

};

ctrlHeater.getDataCollection = function(req, res) {
  HeaterDataCollection.find({}, '-_id -__v')
    .exec(function (err, heaters) {
      if (err) return res.status(500).json(err);
      res.status(200).json(heaters);
    });
};

ctrlHeater.deleteDataCollection = function(req, res) {
  HeaterDataCollection.find({})
    .remove(function (err) {
      if (err) return res.status(500).json(err);
      return res.status(204).json();
    });
};

ctrlHeater.get = function(req, res) {
  async.waterfall([
    function(done) {
      Heater.findOne({ '_id': req.query.id })
        .exec(function (err, heater) {
          if (err) return res.status(500).json(err);
          done(err, heater.toObject());
        });
    },
    function(heater, done) {
      HeaterDataCollection.findOne({ 'iccid': heater.serial }, '-_id -__v')
        .exec(function (err, data) {
          if (err) return res.status(500).json(err);
          heater.data = data;
          done(err, heater);
        });
    },
    function(heater, done) {
      Project.findCurrentHeater(req.session.companyId, req.query.id, heater, done);
    },
    function(heater, done) {
      Project.find({ 'companyId': req.session.companyId, 'objects.silos.heaters.heater': req.query.id })
        .exec(function (err, projects) {
          if (err) return res.status(500).json(err);
          heater.projects = projects;
          done(err, heater);
        });
    },
    function(heater, done) {
      Cru.find({ 'companyId': req.session.companyId, 'deviceId': req.query.id })
        .exec(function (err, records) {
          if (err) return res.status(500).json(err);
          heater.logbook = records;
          done(err, heater);
        });
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

ctrlHeater.post = function(req, res) {
  req.body.companyId = req.session.companyId;

  Company.findOne({'_id': req.session.companyId})
    .exec( function(err, company) {
      if(req.body.operationHours) {
        req.body.periodicService = Math.floor(req.body.operationHours / company.periodicServiceTime, 1);
        req.body.operationsService = Math.floor(req.body.operationHours / company.operationsServiceTime, 1);
      }

      Heater.create(req.body, function (err, heater) {
        if (err) return res.status(500).json(err);
        return res.status(200).json(heater);
      });
    });
};

ctrlHeater.put = function(req, res) {
  Company.findOne({'_id': req.session.companyId})
    .exec( function(err, company) {
      if(req.body.operationHours) {
        req.body.periodicService = Math.floor(req.body.operationHours / company.periodicServiceTime, 1);
        req.body.operationsService = Math.floor(req.body.operationHours / company.operationsServiceTime, 1);
      }

      Heater.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
        .exec( function (err, heater) {
          if (err) return res.status(500).json(err);
          return res.status(200).json(heater);
        });
    });
};

ctrlHeater.getAll = function(req, res) {
  async.waterfall([
    function (done) {
      Heater.find({ 'companyId': req.session.companyId})
        .exec(function (err, heaters) {
          if (err) return res.status(500).json(err);
          done(err, heaters);
        });
    },
    function (heaters, done) {
      async.map( heaters, function(heater, done) {
        heater = heater.toObject();
        Project.find({ 'companyId': req.session.companyId, 'objects.silos.heaters.heater': heater._id })
          .exec(function (err, projects) {
            if (err) return res.status(500).json(err);
            heater.projects = projects;
            Project.findCurrentHeater(req.session.companyId, heater._id, heater, done);
          });
        Cru.find({ 
          companyId: req.session.companyId,
          deviceId: heater._id,
          reason: 'planned_service'
        })
          .exec(function (err, records) {
            if (err) return res.status(500).json(err);
            heater.logbook = records;
          });
      }, done);
    }],
    function(err, done) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(done);
    });
};

ctrlHeater.delete = function(req, res) {
  Heater.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, heater) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

ctrlHeater.changeOperationHours = function(req, res) {
  async.waterfall([
      function (done) {
        Heater.findOne({ '_id': req.body.id })
          .exec(function (err, heater) {
            if (err) return res.status(500).json(err);
            done(err, heater);
          });
      },
      function (heater, done) {
        Company.findOne({'_id': heater.companyId})
          .exec( function(err, company) {
            done(err, company, heater);
          });
      },
      function (company, heater, done) {
        var periodicService = Math.floor(req.body.operationHours / company.periodicServiceTime, 1);

        if(!heater.periodicServiceStatus && heater.periodicService < periodicService) {
          heater.periodicServiceStatus = true;
          heater.periodicService = periodicService;

          Heater.sendService(heater, 'periodic', function(err, _heater) {
            done(err, company, heater)
          });
        } else {
          heater.periodicService = periodicService;
          done(null, company, heater)
        }
      },
      function (company, heater, done) {
        var operationsService = Math.floor(req.body.operationHours / company.operationsServiceTime, 1);

        if(!heater.operationsServiceStatus && heater.operationsService < operationsService) {
          heater.operationsServiceStatus = true;
          heater.operationsService = operationsService;

          Heater.sendService(heater, 'operations', function(err, _heater) {
            done(err, heater)
          });
        } else {
          heater.operationsService = operationsService;
          done(null, heater)
        }
      },
      function (heater, done) {
        heater.operationHours = req.body.operationHours;
        heater.save(function (err, _heater) {
          return done(err, _heater);
        });
      },
      function (heater, done) {
        Project.addOperationHoursCurrentHeater(heater.companyId, heater._id, req.body.operationHours, function () {
          done(null, heater);
        })
      }],
    function(err, done) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(done);
    });
};

ctrlHeater.changeStatus = function(req, res) {
  Heater.findOne({ '_id': req.body.id })
    .exec( function(err, heater) {
      if (err) return res.status(500).json(err);
      heater.status = !heater.status;
      heater.save(function (err, _heater) {
        if (err) return res.status(500).json(err);
        return res.status(200).json(_heater);
      });
    });
};

ctrlHeater.sendAlert = function(req, res) {
  Heater.findOne({ '_id': req.body.id })
    .exec( function(err, heater) {
      Heater.sendAlert(heater, function(err, done) {
        if (err) return res.status(500).json(err);
        heater.alert = true;
        heater.alertDate = new Date();
        heater.save(function (err, _heater) {
            if (err) return res.status(500).json(err);
            return res.status(200).json(_heater);
          });
      });
    });
};

ctrlHeater.confirmAlert = function(req, res) {
  Heater.findOne({ '_id': req.body.id })
    .exec( function(err, heater) {
      if (err) return res.status(500).json(err);
      heater.alert = false;
      heater.save(function (err, _heater) {
        if (err) return res.status(500).json(err);
        return res.status(200).json(_heater);
      });
    });
};

ctrlHeater.sendService = function(req, res) {
  Heater.findOne({ '_id': req.body.id })
    .exec( function(err, heater) {
      Heater.sendService(heater, req.body.type, function(err, done) {
        if (err) return res.status(500).json(err);
        if (req.body.type == 'periodic') heater.periodicServiceStatus = true;
        if (req.body.type == 'operations') heater.operationsServiceStatus = true;
        heater.save(function (err, _heater) {
            if (err) return res.status(500).json(err);
            return res.status(200).json(_heater);
          });
      });
    });
};

ctrlHeater.confirmService = function(req, res) {
  Heater.findOne({ '_id': req.body.id })
    .exec( function(err, heater) {
      if (err) return res.status(500).json(err);
      if (req.body.type == 'periodic') heater.periodicServiceStatus = false;
      if (req.body.type == 'operations') heater.operationsServiceStatus = false;
      heater.save(function (err, _heater) {
        if (err) return res.status(500).json(err);
        return res.status(200).json(_heater);
      });
    });
};

module.exports = ctrlHeater;