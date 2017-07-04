var mongoose = require('mongoose');

var configSchema = new mongoose.Schema({
  expiresIn: { type: Number, default: 2 },
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
