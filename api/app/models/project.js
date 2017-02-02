var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var objectSchema = require('../models/object').schema;
var mailer = require('../lib/mailer');
var config = require('../config/index');
var Company = require('../models/company');

var projectSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  companyId: Schema.Types.ObjectId,
  description: String,
  startDate: Date,
  endDate: Date,
  pm: { type: Schema.Types.ObjectId, ref: 'User'},
  customer: { type: Schema.Types.ObjectId, ref: 'Customer'},
  employee: { type: Schema.Types.ObjectId, ref: 'User'},
  reminderDate: Date,
  archive: { type: Boolean, default: false },
  objects: [objectSchema]
});

projectSchema.statics.cron = function(){
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  this.find(
    {
      'startDate': { '$lt': endDate },
      'endDate': { '$gte': startDate }
    })
    .populate('pm')
    .exec(function (err, projects) {
      projects.forEach(function(project) {
        if(project.archive || !project.pm || !project.pm.username) return;
        Company.findOne({ '_id': project.companyId })
          .exec(function (err, company) {
            if(!company) return;
            if (project.reminderDate ?  moment() - moment(project.reminderDate) > moment.duration(company.reminderTime).as('ms') :
              moment(project.endDate) - moment() < moment.duration(company.reminderProjTime).as('ms')) {
              var subject = __('email.pm_remind_project.subject');
              var text = __('email.pm_remind_project.text', {
                project: project.name,
              });

              text = text + config.clientHost + 'pm/project/' + project._id;
              mailer.sendMail(project.pm.username, subject, text, function() {
                project.reminderDate = moment();
                project.save();
              });
            }
          })
      });
    });
};

projectSchema.statics.findCurrentSilo = function(companyId, id, silo, done){
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  this.findOne(
    {
      'companyId': companyId,
      'startDate': { '$lt': endDate },
      'endDate': { '$gte': startDate },
      'objects.silos.silo': id
    })
    .populate('employee')
    .populate('objects.silos.supplier')
    .populate('objects.silos.orders')
    .populate('objects.silos.orders.supplier')
    .exec(function (err, project) {
      if (project) {

        silo.object = project.objects.find(function (object) {
          return object.silos.some(function (_silo) {
            return _silo.silo.toString() == id;
          });
        });

        var currentSilo = silo.object.silos.find(function (_silo) {
          return _silo.silo.toString() == id;
        });

        silo.supplier = currentSilo.supplier;
        silo.orders = currentSilo.orders;

        silo.employee = project.employee;
      }
      done(err, silo);
    });
};

projectSchema.statics.addOrderCurrentSilo = function(companyId, id, order, done){
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  this.findOne(
    {
      'companyId': companyId,
      'startDate': { '$lt': endDate },
      'endDate': { '$gte': startDate },
      'objects.silos.silo': id
    })
    .exec(function (err, project) {
      if (project) {
        project.objects.forEach(function (object) {
          object.silos.forEach(function (_silo) {
            if (_silo.silo.toString() == id) {
              _silo.orders.push(order);
            }
          });
        });
        project.save(function (err, _project) {
          done(err, project)
        })
      } else {
        done(null, project)
      }
    });
};

projectSchema.statics.findCurrentHeater = function(companyId, id, heater, done){
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  this.findOne(
    {
      'companyId': companyId,
      'startDate': { '$lt': endDate },
      'endDate': { '$gte': startDate },
      'objects.silos.heaters.heater': id
    })
    .populate('pm customer employee')
    .exec(function (err, project) {
      if (project) {
        heater.object = project.objects.find(function (object) {
          return object.silos.find(function (silo) {
            return silo.heaters.some(function (_heater) {
              return _heater.heater.toString() == id;
            });
          });
        });

        heater.pm = project.pm;
        heater.customer = project.customer;
        heater.employee = project.employee;
      }
      done(err, heater);
    });
};

projectSchema.statics.addOperationHoursCurrentHeater = function(companyId, id, operationHours, done){
  var startDate = moment().startOf('d').toDate();
  var endDate = moment().add(1, 'd').startOf('d').toDate();

  this.findOne(
    {
      'companyId': companyId,
      'startDate': { '$lt': endDate },
      'endDate': { '$gte': startDate },
      'objects.silos.heaters.heater': id
    })
    .exec(function (err, project) {
      if (project) {
        project.objects.forEach(function (object) {
          object.silos.forEach(function (silo) {
            silo.heaters.forEach(function (_heater) {
              if (_heater.heater.toString() == id) {
                if(!_heater.startOperationHours) _heater.startOperationHours = operationHours;
                _heater.endOperationHours = operationHours;
              }
            });
          });
        });
        project.save(function (err, _project) {
          done(err, project)
        })
      } else {
        done(null, project)
      }
    });
};

module.exports = mongoose.model('Project', projectSchema);
