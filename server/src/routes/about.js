const express = require('express');
const router = express.Router();

router.get("/about.json", (req, res) => {
  res.json({
    "client": {
      "host": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    },
    "server": {
      "current_time": Date.now(),
    }
  });
});

module.exports = router;
