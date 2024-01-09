const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const url = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_CALLBACK_URL}&response_type=code&scope=channel:read:subscriptions`;

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
