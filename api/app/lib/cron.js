var CronJob = require('cron').CronJob;
var config = require('../config/index');
var Log = require('../models/log');
var Heater = require('../models/heater');
var Order = require('../models/order');
var Project = require('../models/project');

var cron = {
  startCron: function() {
    new CronJob(config.cronTime, function() {

      // console.log('You will see this message every minute', new Date());
      Heater.cron();
      Order.cron();
      Project.cron();
      // Log.create({ url: req.url, method: req.method, name: req.body.iccid, type: 'api' });
    }, null, true, null);
  }
};

module.exports = cron;
