const express = require("express");
const router = express.Router();

// Add required modules for Yammer authentication
const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");
const reactions = require("./reactions");

// Callback route for Yammer
router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }

  let url = `https://www.yammer.com/oauth2/authorize?client_id=${process.env.YAMMER_CLIENT_ID}&response_type=code&redirect_uri=${process.env.YAMMER_CALLBACK_URL}`;
  url += `&state=${req.query.user_id}`;

  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);
router.use("/reaction", reactions);

module.exports = router;
