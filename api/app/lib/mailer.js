var nodemailer = require('nodemailer');
var config = require('../config/index');

var mailer = {
  sendMail: function(to, subject, text, done) {
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
  }
};

module.exports = mailer;
