const express = require('express');
const router = express.Router();

router.use((req, res, next) => { // Log all requests
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

const about = require('./about');
const users = require('./users');

router.use("/", about);
router.use("/", users);

router.get("/", (req, res) => {
  res.send('Pong !');
});

module.exports = router;
