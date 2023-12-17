const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  photoURL: {
    type: String,
    trim: true,
  },
  auth: {
    google: {
      drive: {
        access_token: {
          type: String,
          trim: true,
        },
        refresh_token: {
          type: String,
          trim: true,
        },
        scope: {
          type: String,
          trim: true,
        },
        token_type: {
          type: String,
          trim: true,
        },
        expiry_date: {
          type: Number,
        },
      },
      gmail: {
        access_token: {
          type: String,
          trim: true,
        },
        scope: {
          type: String,
          trim: true,
        },
        token_type: {
          type: String,
          trim: true,
        },
        expiry_date: {
          type: Number,
        },
      },
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
