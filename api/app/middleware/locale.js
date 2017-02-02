var i18n = require('i18n');
var path = require('path');

module.exports = function(app) {
  i18n.configure({
    locales: ['en', 'de'],
    directory: path.join(__dirname, '../config/locales'),
    defaultLocale: 'en',
    register: global,
    objectNotation: true
  });

  app.use(i18n.init);

  app.use(function(req, res, next) {
    res.setLocale(req, req.headers['Accept-Language']);
    next();
  });
};
