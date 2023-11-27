const express = require('express');
const router = express.Router();

router.get("/about.json", (req, res) => {
  var host = req.ip;
  if (host.startsWith("::ffff:"))
    host = host.substring(7);

  const current_time = Math.floor(Date.now() / 1000);

  const data = {
    "client": {
      "host": host
    },
    "server": {
      "current_time": current_time,
    },
  };

  res.json(data);
});

module.exports = router;
