const express = require("express");
const router = express.Router();

const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");

router.get("/", async (req, res) => {
  const baseURL = "https://discord.com/api/oauth2/authorize";

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.DISCORD_CALLBACK_URL,
    scope: "identify",
  });

  const url = `${baseURL}?${params}`;

  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);

module.exports = router;
