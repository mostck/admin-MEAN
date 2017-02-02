var async = require('async');
var moment = require('moment');
var Order = require('../models/order');
var Project = require('../models/project');
var User = require('../models/user');

var ctrlStatistics = {};

ctrlStatistics.getByProject = function(req, res) {
  Project.find(
    {
      'companyId': req.session.companyId
    })
    .populate('objects.silos.silo')
    .populate('objects.silos.orders')
    .populate('objects.silos.heaters.heater')
    .exec(function (err, _projects) {
      if (err) return res.status(500).json(err);
      var projects = [];
      _projects.forEach((project) => {
        project = project.toObject();

        project.operationHours = 0;
        project.amountOfTons = 0;

        project.objects.forEach((object) => {

          object.operationHours = 0;
          object.amountOfTons = 0;

          object.silos.forEach((silo) => {
            silo.name = silo.silo ? silo.silo.serial : 'undefined';
            silo.days = moment.duration((moment() < moment(silo.endDate) ? moment() : moment(silo.endDate)).startOf('d') - (moment() < moment(silo.startDate) ? moment() : moment(silo.startDate)).startOf('d')).as('days');

            silo.operationHours = 0;
            silo.heaters.forEach((heater) => {
               silo.operationHours = silo.operationHours + (heater.endOperationHours && heater.startOperationHours ? heater.endOperationHours - heater.startOperationHours : 0);
            });
            object.operationHours = object.operationHours + silo.operationHours;

            silo.amountOfTons = 0;
            silo.orders.forEach((order) => {
               silo.amountOfTons = silo.amountOfTons + (order.deliveredAt && order.amountOfTons ? order.amountOfTons : 0);
            });
            object.amountOfTons = object.amountOfTons + silo.amountOfTons;
          });

          object.days = moment.duration((moment() < moment(object.endDate) ? moment() : moment(object.endDate)).startOf('d') - (moment() < moment(object.startDate) ? moment() : moment(object.startDate)).startOf('d')).as('days');
          project.operationHours = project.operationHours + object.operationHours;
          project.amountOfTons = project.amountOfTons + object.amountOfTons;
        });

        project.days = moment.duration((moment() < moment(project.endDate) ? moment() : moment(project.endDate)).startOf('d') - (moment() < moment(project.startDate) ? moment() : moment(project.startDate)).startOf('d')).as('days');
        projects.push(project)
      });

      res.status(200).json(projects);
    });
};

ctrlStatistics.getBySupplier = function(req, res) {
  var startDate = moment(req.query.startDate).startOf('d').toDate();
  var endDate = moment(req.query.endDate).add(1, 'd').startOf('d').toDate();

  Order
    .aggregate([
      { $match: { 'deliveredAt': { '$gte': startDate, '$lt': endDate } }},
      { $group: { _id : "$supplier", supplier: { "$first": "$supplier" }, amountOfTons: { $sum: "$amountOfTons" } } }
    ])
    .exec(function (err, transactions) {
      User.populate(transactions, {path: 'supplier'}, function(err, populatedTransactions) {
        if (err) return res.status(500).json(err);
        res.status(200).json(populatedTransactions);
      });

    })
};

module.exports = ctrlStatistics;