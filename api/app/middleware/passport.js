var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/index');

module.exports = function(app) {
  app.use(passport.initialize());

  app.use(function (req, res, next) {
    function fetch(headers) {
      if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
         return part[1];
        }
      }
    }

    var token = fetch(req.headers);

    if(token) {
      jwt.verify(token, config.jwtSecret, function (err, decode) {
        User.findOne({ username: decode.username }, '+salt +hash')
          .exec(function (err, user) {
            if (err) { return next(err); }
            if (!user || user.roleId != decode.roleId || (user.permissions && decode.permissions && JSON.stringify(user.permissions) != JSON.stringify(decode.permissions))) {
              var err = new Error('User not found');
              err.status = 401;
              return next(err);
            }
            return next();
          });
      });
    } else {
      next();
    }
  });

  passport.use(new LocalStrategy({
      usernameField: 'username'
    },
    function(username, password, done) {
      User.findOne({ username: username }, '+salt +hash')
        .exec(function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, {
              message: 'User not found'
            });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: 'Password is wrong'
            });
          }
          return done(null, user);
        });
    }));
};


