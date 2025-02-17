const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only for email/password signup
  googleId: { type: String }, // Only for Google OAuth signup
  avatar: { type: String },
});

module.exports = mongoose.model('User', UserSchema);