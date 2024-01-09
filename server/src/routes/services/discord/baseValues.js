const express = require("express");
const router = express.Router();
const DiscordApiHandler = require("./utils/DiscordApiHandler");

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.discord?.access_token;
    console.log("accessToken: ", accessToken);
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const discordApiHandler = new DiscordApiHandler(accessToken);
    const servers = await discordApiHandler.getMyServers();

    baseValues = {
      servers: servers,
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
