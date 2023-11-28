const express = require('express');
const router = express.Router();

const about = require('./about');
const users = require('./users');

router.use("/", about);
router.use("/", users);

router.get("/", (req, res) => {
  res.send('Pong !');
});

module.exports = router;
