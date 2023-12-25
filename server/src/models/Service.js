const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name_long: {
    type: String,
    trim: true,
  },
  name_short: {
    type: String,
    trim: true,
    unique: true,
  },
  route: {
    type: String,
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    trim: true,
  },
  actions: [
    {
      name_long: {
        type: String,
        trim: true,
      },
      name_short: {
        type: String,
        trim: true,
      },
    },
  ],
  reactions: [
    {
      name_long: {
        type: String,
        trim: true,
      },
      name_short: {
        type: String,
        trim: true,
      },
    },
  ],
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
