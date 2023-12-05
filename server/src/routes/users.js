const express = require('express');
const router = express.Router();

router.get("/users", async (req, res) => {
  const User = require('../model/User');

  var users = await User.find({});

  res.send(users);
});

module.exports = router;
