var async = require('async');
var Project = require('../models/project');
var Silo = require('../models/silo');
var Heater = require('../models/heater');
var Company = require('../models/company');
var moment = require('moment');
var mailer = require('../lib/mailer');
var config = require('../config/index');

var ctrlProject = {};

ctrlProject.get = function(req, res) {
  Project.findOne({ '_id': req.query.id })
    .populate('objects.silos.silo')
    .populate('objects.silos.orders')
    .populate('objects.silos.heaters.heater')
    .exec(function (err, project) {
      if (err) return res.status(500).json(err);
      res.status(200).json(project);
    });
};

ctrlProject.post = function(req, res) {
  req.body.companyId = req.session.companyId;
  req.body.userId = req.session._id;

  Project.create(req.body, function (err, project) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(project);
    });
};

ctrlProject.confirm = function(req, res) {
  Project.findOneAndUpdate({ '_id': req.body.id }, { 'archive': true, 'reminderDate': null }, { new: true })
    .exec(function (err, project) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(project);
    });
};

ctrlProject.prolong = function(req, res) {
  Project.findOneAndUpdate({ '_id': req.body.project._id }, { 'reminderDate': null }, { new: true })
    .populate('objects.silos.silo')
    .populate('objects.silos.heaters.heater')
    .populate('employee')
    .exec(function (err, project) {
      if (err) return res.status(500).json(err);

      var text = __('project.name') + ': ' + project.name + ' ' + __('project.endDate') + ': ' + project.endDate + '\n\n ' + __('common.objects') + ':\n';
      project.objects.forEach(function (object) {
        text = text + ' ' + __('object.name') + ': ' + object.name + ' ' + __('project.endDate') + ': ' + object.endDate + '\n   ' + __('common.silos') + ':\n';
        object.silos.forEach(function (silo) {
          text = text + '   ' + __('device.serial') + ': ' + silo.silo.serial + ' ' + __('project.endDate') + ': ' + silo.endDate + '\n     ' + __('common.heaters') + ':\n';
          silo.heaters.forEach(function (heater) {
            text = text + '     ' +__('device.serial') + ': ' + heater.heater.serial + ' ' + __('project.endDate') + ': ' + heater.endDate + '\n';
          });
          text = text + '\n';
        });
        text = text + '\n';
      });


      var subject = __('email.pm_prolong_project.subject');
      text = __('email.pm_prolong_project.text', {
        project: text,
      });

      text = text + config.clientHost + 'admin/projects/update/' + project._id;
      mailer.sendMail(project.employee.username, subject, text, function() {
        return res.status(200).json(project);
      });
    });
};

ctrlProject.put = function(req, res) {
  req.body.archive = false;
  Project.findOneAndUpdate({ '_id': req.body._id }, { $set: req.body }, { new: true })
    .exec(function (err, project) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(project);
    });
};

ctrlProject.getAll = function(req, res) {
  Project.find({ 'companyId': req.session.companyId})
    .populate('objects.silos.silo')
    .populate('objects.silos.orders')
    .populate('objects.silos.orders.supplier')
    .populate('objects.silos.heaters.heater')
    .exec(function (err, projects) {
      if (err) return res.status(500).json(err);
      res.status(200).json(projects);
    });
};

ctrlProject.getAllCustomer = function(req, res) {
  Project.find({ 'companyId': req.session.companyId, 'customer': req.params.id })
    .populate('objects.silos.silo')
    .populate('objects.silos.orders')
    .populate('objects.silos.heaters.heater')
    .exec(function (err, projects) {
      if (err) return res.status(500).json(err);
      res.status(200).json(projects);
    });
};

ctrlProject.getAllSupplier = function(req, res) {
  Project.find({ 'companyId': req.session.companyId, 'objects.silos.supplier': req.params.id })
    .populate('objects.silos.silo')
    .populate('objects.silos.orders')
    .populate('objects.silos.orders.supplier')
    .populate('objects.silos.heaters.heater')
    .exec(function (err, projects) {
      if (err) return res.status(500).json(err);
      res.status(200).json(projects);
    });
};

ctrlProject.delete = function(req, res) {
  Project.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, project) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlProject;