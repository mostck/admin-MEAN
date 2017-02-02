var Config = require('../models/config');

module.exports = function(app) {
  app.use(function(req, res, next) {
    Config.findOne({})
      .exec(function (err, config) {
        req.config = config;
        next();
      });
  });
};
