var passport = require('passport');
var User = require('../models/user');
var config = require('../config/index');
var async = require('async');
var mailer = require('../lib/mailer');
var crypto = require('crypto');

var ctrlAuth = {};

ctrlAuth.getRegister = function(req, res) {
  res.status(200).json('register', { });
};

ctrlAuth.postRegister = function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.companyId = req.body.companyId;
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateJwt();
    res.status(200).json({
      "token" : token
    });
  });
};

ctrlAuth.getLogin = function(req, res) {
  res.status(200).json('login', { user : req.user });
};

ctrlAuth.postLogin = function(req, res) {
  passport.authenticate('local', function(err, user, info) {
    var token;

    if (err) {
      res.status(500).json(err);
      return;
    }

    if(user){
      token = user.generateJwt();
      res.status(200).json({"token" : token});
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

ctrlAuth.getLogout = function(req, res) {
  res.status(200).json({
    status: 'Bye!'
  });
};

ctrlAuth.getPing = function(req, res) {
  res.status(200).json("pong!");
};

ctrlAuth.postForgot = function(req, res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ username: req.body.username })
        .exec( function(err, user) {
          if (!user) {
            return res.status(500).json('not found!');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
    },
    function(token, user, done) {
      var to = user.username;
      var subject = __('email.forgot_password.subject');
      var text = decodeURIComponent(__('email.forgot_password.text', { link: encodeURIComponent(config.clientHost + '/reset/' + token)}))

      mailer.sendMail(to, subject, text, done);
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

ctrlAuth.getResetToken = function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
    .exec( function(err, user) {
      if (!user) {
        return res.status(500).json('not found!');
      }
      return res.status(200).json({username: user.username});
    });
};

ctrlAuth.postResetToken = function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, '+resetPasswordToken +resetPasswordExpires')
        .exec( function(err, user) {
          if (!user) {
            return res.status(500).json('not found!');
          }

          user.setPassword(req.body.password);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            done(err, user);
          });
      });
    },
    function(user, done) {
      var to = user.username;
      var subject = __('email.changed_password.subject');
      var text = __('email.changed_password.text', { username: user.username});

      mailer.sendMail(to, subject, text, done);
    }
  ], function(err, done) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(done);
  });
};

module.exports = ctrlAuth;