var Log = require('../models/log');

module.exports = function(app) {
  app.use(function (req, res, next) {
    if(req.session && (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') && req.url != '/api/user') {
      Log.create({ url: req.url, method: req.method, name: req.session.username, type: 'user', body: req.body });
    }

    next();
  });
};