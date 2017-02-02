module.exports = {
  jwtSecret: '$a&F1m3377E]W:+',
  host: 'http://127.0.0.1:3000',
  clientHost: 'http://5.148.165.8/',
  port: '3000',
  mongodb: 'mongodb://127.0.0.1/heater-silo-m2m',
  cronTime: '0 */10 * * * *',
  smtp: {
    host: "smtp.mailgun.org",
    auth: {
      user: 'postmaster@sandboxb0d87eeafb91438dbea8092175f256ca.mailgun.org', // Default SMTP Login
      pass: 'a89257d20e63ec2e3385cbd86b1e6a27' // Default Password
    }
  },
  daysOfWeek: {
    '1': 'monday',
    '2': 'tuesday',
    '3': 'wednesday',
    '4': 'thursday',
    '5': 'friday',
    '6': 'saturday',
    '7': 'sunday'
  }
};