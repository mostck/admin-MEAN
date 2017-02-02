
var Config = require('../models/config');

var ctrlConfig = {};

ctrlConfig.get = function(req, res) {
  Config.findOne({}).exec(function (err, config) {
    if (err) return res.status(500).json(err);
    res.status(200).json(config);
  });
};

ctrlConfig.put = function(req, res) {
  Config.findOneAndUpdate({} , { $set:req.body }, { new: true }).exec(function(err, config) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(config);
  });
};

ctrlConfig.post = function(req, res) {
  Config.create(req.body, function (err, config) {
    if (err) return res.status(500).json(err);
    return res.status(200).json(config);
  });
};

module.exports = ctrlConfig;