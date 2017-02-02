var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Company = require('../models/company');
var Silo = require('../models/silo');
var Project = require('../models/project');

var async = require('async');
var moment = require('moment');
var mailer = require('../lib/mailer');
var config = require('../config/index');

var orderSchema = new mongoose.Schema({
  number: { type: String, unique: true },
  companyId: Schema.Types.ObjectId,
  supplier: { type: Schema.Types.ObjectId, ref: 'User' },
  silo: { type: Schema.Types.ObjectId, ref: 'Silo' },
  createdAt: { type: Date, default: Date.now },
  plannedDeliveryAt: Date,
  deliveredAt: Date,
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'confirmed', 'delivered']
  },
  amountOfTons: Number,
  amountCHF: Number,
  reminderDate: { type: Date, default: Date.now }
});

orderSchema.statics.cron = function(){
  var _this = this;

  _this.find({})
    .or([{ status: 'open' }, { status: 'confirmed' }])
    .populate('silo')
    .populate('silo.supplier')
    .exec( function(err, orders) {
      orders.forEach(function (order) {
        Company.findOne({ '_id': order.companyId })
          .exec(function (err, company) {
            if(!company) return;
            if(moment() - moment(order.reminderDate) > moment.duration(company.reminderTime).as('ms')
              && (order.status == 'open' || order.status == 'confirmed' && moment() > moment(order.plannedDeliveryAt))) {

              async.waterfall([
                function(done) {
                  Project.findCurrentSilo(order.silo.companyId, order.silo._id, order.silo, done);
                },
                function(silo, done) {
                  var object = silo.object ? silo.object : {};
                  var address = object && object.location && object.location.address ? object.location.address : {};
                  var address = object && object.location && object.location.address ? object.location.address :
                    silo.location && silo.location.address ? silo.location.address : {};
                  // var estimateDate = req.body.estimateDate ? req.body.estimateDate : {};
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
                      fillingLevel: Math.round(silo.fillingLevel/silo.maxLoad*100 * 100) / 100,
                      address: __('address.country') + ': ' + (address.country ? address.country : '') + ' ' +
                      __('address.town') + ': ' + (address.town ? address.town : '') + ' ' +
                      __('address.streetNr') + ': ' + (address.streetNr ? address.streetNr : '') + ' ' +
                      __('address.additionalLine') + ': ' + (address.additionalLine ? address.additionalLine : '') + ' ' +
                      __('address.zip') + ': ' + (address.zip ? address.zip : ''),
                      daysOfWeek: daysOfWeek,
                      holiday: possibleDeliveryTime.holiday ? possibleDeliveryTime.holiday : '',
                      сomment: object.сomment ? object.сomment : '',
                      // estimateDate: __('date.months') + ': ' + estimateDate.months ? estimateDate.months : '' + ' ' +
                      // __('date.days') + ': ' + estimateDate.days ? estimateDate.days : '' + ' ' +
                      // __('date.hours') + ': ' + estimateDate.hours ? estimateDate.hours : '' + ' ' +
                      // __('date.minutes') + ': ' + estimateDate.minutes ? estimateDate.minutes : ''
                    });

                  text = text + config.clientHost + 'supplier/order/' + order._id;

                  var doneMail = function (err, status) {
                    if (err) return done(err);
                    done(err, silo);
                  };
                  if (silo.supplier && silo.supplier.username) {
                    mailer.sendMail(silo.supplier.username, subject, text, function () {
                      var currentTime = moment();
                      var startTime = moment(company.officeTime.startTime, 'HH:mm');
                      var endTime = moment(company.officeTime.endTime, 'HH:mm');
                      if (silo.employee && silo.employee.username && startTime - currentTime < 0 && endTime - currentTime > 0 && company.officeTime.daysOfWeek.includes(currentTime.isoWeekday())) {
                        mailer.sendMail(silo.employee.username, subject, text, doneMail);
                      } else if(company.email){
                        mailer.sendMail(company.email, subject, text, doneMail);
                      } else {
                        done(null, silo);
                      }
                    });
                  }
                },
                function(silo, done) {
                  order.reminderDate = new Date();
                  order.save(function (err, _order) {
                    done(err, _order);
                  });
                },
              ], function(err, done) {
                return;
              });
            }
          });
      })
    });
};

module.exports = mongoose.model('Order', orderSchema);