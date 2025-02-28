const mongoose = require('mongoose');

const EmailOTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // automatically expire after 10 minutes
});

module.exports = mongoose.model('EmailOTP', EmailOTPSchema);