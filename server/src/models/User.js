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
      expiry_date: Number,
    },
    yammer: {
      user_id: Number,
      network_id: Number,
      network_permalink: String,
      network_name: String,
      network_canonical: Boolean,
      network_primary: Boolean,
      token: String,
      view_members: Boolean,
      view_groups: Boolean,
      view_messages: Boolean,
      view_subscriptions: Boolean,
      modify_subscriptions: Boolean,
      modify_messages: Boolean,
      view_tags: Boolean,
      created_at: String,
      authorized_at: String,
      expires_at: String,
    },
    github: {
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
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
