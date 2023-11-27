const express = require('express');
const router = express.Router();

const about = require('./about');

router.use("/", about);

router.get("/", (req, res) => {
  res.send('Pong !');
});

module.exports = router;
