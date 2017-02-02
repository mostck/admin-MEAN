var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = require('../models/location').schema;

var async = require('async');
var moment = require('moment');
var mailer = require('../lib/mailer');
var config = require('../config/index');
var Company = require('../models/company');
var Project = require('../models/project');

var heaterSchema = new mongoose.Schema({
  serial: { type: String, unique: true },
  serialNr: String,
  companyId: Schema.Types.ObjectId,
  operationHours: { type: Number, default: 0 },
  location: locationSchema,
  status: { type: Boolean, default: false },
  alert: { type: Boolean, default: false },
  alertDate: Date,
  periodicServiceStatus: { type: Boolean, default: false },
  operationsServiceStatus: { type: Boolean, default: false },
  periodicService: { type: Number, default: 0 },
  operationsService: { type: Number, default: 0 }
});

heaterSchema.statics.cron = function(){
  var _this = this;
  _this.find({ 'status': true, 'alert': true })
    .exec( function(err, heaters) {
      heaters.forEach(function (heater) {
        Company.findOne({ '_id': heater.companyId })
          .exec(function (err, company) {
            if(!company) return;
            if(moment() - moment(heater.alertDate) > moment.duration(company.reminderTime).as('ms')) {
              if(heater.alert == true) {
                _this.sendAlert(heater, function (err, done) {
                  if (err) return;
                  heater.alertDate = new Date();
                  heater.save(function (err, _heater) {
                    if (err) return;
                    return;
                  });
                })
              }
            }
          });
      })
    });
};

heaterSchema.statics.sendAlert = function(device, callback) {
  device = device.toObject();

  async.waterfall([
    function(done) {
      Company.findOne({ '_id': device.companyId })
        .exec(function (err, company) {
          device.company = company;
          done(err, device);
        });
    },
    function(heater, done) {
      Project.findCurrentHeater(heater.companyId, heater._id, heater, done);
    },
    function(heater, done) {
      if(!heater.company) return done('not found company', null);
      var currentTime = moment();
      var startTime = moment(heater.company.officeTime.startTime, 'HH:mm');
      var endTime = moment(heater.company.officeTime.endTime, 'HH:mm');

      var address = heater.object && heater.object.location && heater.object.location.address ? heater.object.location.address :
        heater.location && heater.location.address ? heater.location.address : {};
      var subject = __('email.alert_heater.subject');
      var text = __('email.alert_heater.text', {
        serial: heater.serial,
        address: __('address.country') + ': ' + (address.country ? address.country : '') + ' ' +
        __('address.town') + ': ' + (address.town ? address.town : '') + ' ' +
        __('address.streetNr') + ': ' + (address.streetNr ? address.streetNr : '') + ' ' +
        __('address.additionalLine') + ': ' + (address.additionalLine ? address.additionalLine : '') + ' ' +
        __('address.zip') + ': ' + (address.zip ? address.zip : ''),
      });

      text = text + config.clientHost + 'heater/' + heater._id;

      var doneMail = function (err, status) {
        if (err) return done(err);
        done(err, heater);
      };
      if (heater.employee && heater.employee.username && startTime - currentTime < 0 && endTime - currentTime > 0 && heater.company.officeTime.daysOfWeek.includes(currentTime.isoWeekday())) {
        mailer.sendMail(heater.employee.username, subject, text, doneMail);
      } else if(heater.company && heater.company.email) {
        mailer.sendMail(heater.company.email, subject, text, doneMail);
      } else {
        done(null, heater)
      }
    }
  ], function(err, done) {
    callback(err, done)
  });
};

heaterSchema.statics.sendService = function(device, type, callback) {
  device = device.toObject();

  async.waterfall([
    function(done) {
      Company.findOne({ '_id': device.companyId })
        .exec(function (err, company) {
          device.company = company;
          done(err, device);
        });
    },
    function(heater, done) {
      Project.findCurrentHeater(heater.companyId, heater._id, heater, done);
    },
    function(heater, done) {
      if(!heater.company) return done('not found company', null);
      var currentTime = moment();
      var startTime = moment(heater.company.officeTime.startTime, 'HH:mm');
      var endTime = moment(heater.company.officeTime.endTime, 'HH:mm');

      var address = heater.object && heater.object.location && heater.object.location.address ? heater.object.location.address :
        heater.location && heater.location.address ? heater.location.address : {};
      var subject;
      var text;

      if (type = 'periodic') {
        subject = __('email.periodic_heater.subject');
        text = __('email.periodic_heater.text', {
          serial: heater.serial,
          address: __('address.country') + ': ' + (address.country ? address.country : '') + ' ' +
          __('address.town') + ': ' + (address.town ? address.town : '') + ' ' +
          __('address.streetNr') + ': ' + (address.streetNr ? address.streetNr : '') + ' ' +
          __('address.additionalLine') + ': ' + (address.additionalLine ? address.additionalLine : '') + ' ' +
          __('address.zip') + ': ' + (address.zip ? address.zip : '')
        });
      } else if (type = 'operations') {
        subject = __('email.operations_heater.subject');
        text = __('email.operations_heater.text', {
          serial: heater.serial,
          address: __('address.country') + ': ' + (address.country ? address.country : '') + ' ' +
          __('address.town') + ': ' + (address.town ? address.town : '') + ' ' +
          __('address.streetNr') + ': ' + (address.streetNr ? address.streetNr : '') + ' ' +
          __('address.additionalLine') + ': ' + (address.additionalLine ? address.additionalLine : '') + ' ' +
          __('address.zip') + ': ' + (address.zip ? address.zip : '')
        });
      }

      text = text + config.clientHost + 'heater/' + heater._id;

      var doneMail = function (err, status) {
        if (err) return done(err);
        done(err, heater);
      };
      if (heater.employee && heater.employee.username && startTime - currentTime < 0 && endTime - currentTime > 0 && heater.company.officeTime.daysOfWeek.includes(currentTime.isoWeekday())) {
        mailer.sendMail(heater.employee.username, subject, text, doneMail);
      } else if(heater.company && heater.company.email){
        mailer.sendMail(heater.company.email, subject, text, doneMail);
      } else {
        done(null, heater);
      }
    }
  ], function(err, done) {
    callback(err, done)
  });
};

module.exports = mongoose.model('Heater', heaterSchema);
