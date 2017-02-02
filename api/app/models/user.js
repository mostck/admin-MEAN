var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/index');
var addressSchema = require('../models/address').schema;

var userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  companyId: Schema.Types.ObjectId,
  roleId: { type: Number, default: 3 },
  permissions: Object,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  realName: String,
  phone: String,
  address: addressSchema,
  companyName: {type: String, unique: true},
  preferredLanguage: String,
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

userSchema.methods.generateJwt = function() {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    companyId: this.companyId,
    roleId: this.roleId,
    permissions: this.permissions,
    customer: this.customer,
    companyName: this.companyName,
    preferredLanguage: this.preferredLanguage
  }, config.jwtSecret);
};

module.exports = mongoose.model('User', userSchema);
