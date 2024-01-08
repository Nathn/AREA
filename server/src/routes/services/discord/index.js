const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&scope=identify`;

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
