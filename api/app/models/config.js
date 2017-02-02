var mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  email: String,
  smtp: {
    host: String,
    auth: {
      user: String,
      pass: String
    }
  }
});

module.exports = mongoose.model('Config', configSchema);
