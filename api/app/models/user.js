var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var addressSchema = require('../models/address').schema;

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  roleId: { type: Number, default: 2 },
  realName: String,
  phone: String,
  address: addressSchema,
  hash: { type: String, select: false },
  salt: { type: String, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function(expiresIn) {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    roleId: this.roleId
  }, config.jwtSecret, { expiresIn: expiresIn*60*60 });
};

module.exports = mongoose.model('User', userSchema);
