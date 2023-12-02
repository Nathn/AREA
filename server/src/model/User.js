const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  created_at: Date,
  updated_at: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
