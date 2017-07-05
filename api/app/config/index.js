module.exports = {
  jwtSecret: '$a&F1m3377E]W:+',
  clientHost: 'http://localhost:8080/',
  port: 3000,
  mongodb: 'mongodb://0.0.0.0/node-tpl-api',
  expiresIn: 2,
  email: "unknown@gmail.com",
  smtp: {
    host: "smtp.mailgun.org",
    auth: {
      user: 'postmaster@sandboxb0d87eeafb91438dbea8092175f256ca.mailgun.org', // Default SMTP Login
      pass: 'a89257d20e63ec2e3385cbd86b1e6a27' // Default Password
    }
  }
};