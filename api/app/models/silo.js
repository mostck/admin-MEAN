var requestPromise = require('request-promise');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var locationSchema = require('../models/location').schema;
var config = require('../config/index');

var siloSchema = new mongoose.Schema({
  serial: { type: String, unique: true },
  serialNr: { type: String },
  companyId: Schema.Types.ObjectId,
  maxLoad: Number,
  fillingLevel: Number,
  changeFillingLevelDate: Date,
  estimateTime: Number,
  location: locationSchema,
  reminderStatus: { type: Number, default: 0 }
});


var optionsSilos = {
  uri: 'https://vis.vega.com/api/Values/all/latest/1/',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer '
  },
  json: true // Automatically parses the JSON string in the response
};

siloSchema.statics.cron = function(){
  var _this = this;

  requestPromise(config.request.silo.optionsAuthorization)
    .then(function (authorization) {
      var optionsGetSilos = config.request.silo.optionsGetSilos;
      optionsGetSilos.headers.Authorization = optionsSilos.headers.Authorization + authorization.access_token;

      requestPromise(optionsGetSilos)
        .then(function (silos) {
          silos.forEach(function (silo) {
            _this.findOne({ 'serial': silo.Id })
              .exec(function (err, currentSilo) {
                if(err || !currentSilo) return;
                currentSilo.fillingLevel = silo.MeasuringConfigs[0].Values[0].Value;
                currentSilo.save();
              });
          })

        })
        .catch(function (err) {
          console.log('Silos has err', err);
        });
    })
    .catch(function (err) {
      console.log('User has err', err);
    });
};

module.exports = mongoose.model('Silo', siloSchema);
