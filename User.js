const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: String,
  password: { type: String, required: true },
  type: { type: String, enum: ['login', 'register'], required: true }
});

module.exports = mongoose.model('User', userSchema);
