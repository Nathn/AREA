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
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    yammer: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    github: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    outlook: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    discord: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    facebook: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    reddit: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
    stackoverflow: {
      type: mongoose.Schema.Types.Mixed,
      trim: true,
    },
  },
  action_reactions: [
    {
      action: {
        type: String,
        required: true,
        trim: true,
      },
      reaction: {
        type: String,
        required: true,
        trim: true,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
