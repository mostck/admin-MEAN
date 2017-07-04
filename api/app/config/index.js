module.exports = {
  jwtSecret: '$a&F1m3377E]W:+',
  host: 'http://52.72.94.194:8199',
  clientHost: 'http://localhost:8080/',
  port: 3000,
  mongodb: 'mongodb://0.0.0.0/heater-silo-m2m',
  cronTime: '0 */10 * * * *', // every hour
  smtp: {
    host: "smtp.mailgun.org",
    auth: {
      user: 'postmaster@sandboxb0d87eeafb91438dbea8092175f256ca.mailgun.org', // Default SMTP Login
      pass: 'a89257d20e63ec2e3385cbd86b1e6a27' // Default Password
    }
  },
  request: {
    silo: {
      optionsAuthorization: {
        uri: 'https://vis.vega.com/token',
        method: 'POST',
        form: {
          'grant_type': 'password',
          'username': 'rk@shoreit.ch',
          'password': 'abcd§1234'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
      },
      optionsGetSilos: {
        uri: 'https://vis.vega.com/api/Values/all/latest/1/',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer '
        },
        json: true
      }
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