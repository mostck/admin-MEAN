
var User = require('../models/user');

var ctrlUser = {};

ctrlUser.post = function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.companyId = req.body.companyId;
  user.roleId = req.body.roleId;
  user.realName = req.body.realName;
  user.phone = req.body.phone;
  user.address = req.body.address;
  user.preferredLanguage = req.body.preferredLanguage;
  user.permissions = req.body.permissions;
  user.customer = req.body.customer;
  user.companyName = req.body.companyName;
  user.setPassword(req.body.password);

  user.save(function(err) {
    if (err) return res.status(500).json(err);
    return res.status(200).json({});
  });
};

ctrlUser.put = function(req, res) {
  User.findOne({ '_id': req.body._id }, function (err, user) {
    if (err) return res.status(500).json(err);
    user.username = req.body.username;
    user.companyId = req.body.companyId;
    user.roleId = req.body.roleId;
    user.realName = req.body.realName;
    user.phone = req.body.phone;
    user.address = req.body.address;
    user.preferredLanguage = req.body.preferredLanguage;
    user.permissions = req.body.permissions;
    user.customer = req.body.customer;
    user.companyName = req.body.companyName;
    if(req.body.password) {
      user.setPassword(req.body.password);
    };
    user.save(function(err) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
  })
};

ctrlUser.get = function(req, res) {
  User.findOne({ '_id': req.query.id })
    .exec(function (err, user) {
      if (err) return res.status(500).json(err);
      res.status(200).json(user);
    });
};

ctrlUser.getAll = function(req, res) {
  User.find({ companyId: req.session.companyId })
    .or([{ 'roleId': 2 }, { 'roleId': 3 }, { 'roleId': 4 }, { 'roleId': 5 }, { 'roleId': 6 }])
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllEmployees = function(req, res) {
  User.find({ 'companyId': req.session.companyId})
    .or([{ 'roleId': 2 }, { 'roleId': 3 }])
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllSuppliers = function(req, res) {
  User.find({ 'companyId': req.session.companyId, 'roleId': 4 })
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllPms = function(req, res) {
  User.find({ 'companyId': req.session.companyId })
    .or([{ 'roleId': 5 }, { 'roleId': 6 }])
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllPmsAdmin = function(req, res) {
  User.find({ 'companyId': req.session.companyId, 'roleId': 5 })
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllPmsCustomer = function(req, res) {
  User.find({ 'companyId': req.session.companyId, 'roleId': 6, 'customer': req.params.id })
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.getAllAdmins = function(req, res) {
  User.find({})
    .or([{ 'roleId': 1 }, { 'roleId': 2 }])
    .exec(function (err, users) {
      if (err) return res.status(500).json(err);
      res.status(200).json(users);
    });
};

ctrlUser.delete = function(req, res) {
  User.findOneAndRemove({ '_id': req.params.id })
    .exec( function (err, user) {
      if (err) return res.status(500).json(err);
      return res.status(200).json();
    });
};

module.exports = ctrlUser;