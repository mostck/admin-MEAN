var User = require('../models/user');

var ctrlUser = {};

ctrlUser.post = function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.roleId = req.body.roleId;
  user.realName = req.body.realName;
  user.phone = req.body.phone;
  user.address = req.body.address;
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
    user.roleId = req.body.roleId;
    user.realName = req.body.realName;
    user.phone = req.body.phone;
    user.address = req.body.address;
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
  User.find()
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