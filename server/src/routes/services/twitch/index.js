const express = require("express");

const router = express.Router();

const callback = require("./callback");
const baseValues = require("./baseValues");
const actions = require("./actions");
// const reactions = require("./reactions");

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }
  let url = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_CALLBACK_URL}&response_type=code&scope=channel:read:subscriptions%20user:read:follows`;
  url += `&state=${req.query.user_id}`;
  res.send(url);
});

router.use("/", callback);
router.use("/", baseValues);
router.use("/action", actions);
// router.use("/reaction", reactions);

module.exports = router;
