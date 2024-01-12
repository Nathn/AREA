const express = require("express");
const router = express.Router();

const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }
  const baseURL = "https://discord.com/api/oauth2/authorize";

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.DISCORD_CALLBACK_URL,
    scope: "identify guilds",
  });

  let url = `${baseURL}?${params}`;
  url += `&state=${req.query.user_id}`;
  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);

module.exports = router;
