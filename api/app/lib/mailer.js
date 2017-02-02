var nodemailer = require('nodemailer');
var Config = require('../models/config');

var mailer = {
  sendMail: function(to, subject, text, done) {
    Config.findOne({})
      .exec(function (err, config) {
        if (!config) return;
        var smtpTransport = nodemailer.createTransport(config.smtp);
        var mailOptions = {
          to: to,
          from: config.email,
          subject: subject,
          text: text
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err, 'done');
        });
      });
  }
};

module.exports = mailer;
