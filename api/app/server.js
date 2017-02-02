var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var methodOverride = require('method-override');
var expressJwt = require('express-jwt');
var cookieParser = require('cookie-parser');

var routes = require('./routes');
var config = require('./config/index');

var cron = require('./lib/cron');

var app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));
app.use(bodyParser.json({limit: '2mb'}));
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(methodOverride('X-HTTP-Method-Override'));

require('./middleware/cors')(app);

app.use(expressJwt({ secret: config.jwtSecret, userProperty: 'session' })
  .unless({path: [ /\/api\/(login|register|forgot|reset|uploads|lang|heater\/status).*/ ]}));

app.use(cookieParser());

require('./middleware/passport')(app);

// require('./middleware/config')(app);

require('./middleware/locale')(app);

require('./middleware/logger')(app);

app.use('/api', routes);

require('./middleware/error')(app);

connect()
  .on('error', console.log)
  // .on('disconnected', connect)
  .once('open', listen);

function listen () {
  app.listen(config.port);
  console.log('Express app started on port ' + config.port);
  cron.startCron();
}

function connect () {
  // var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.Promise = global.Promise;
  return mongoose.connect(config.mongodb).connection;
}

module.exports = app;