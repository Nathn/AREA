const express = require("express");
const router = express.Router();
const DiscordApiHandler = require("./utils/DiscordApiHandler");

router.post("/createOrJoinServer", async (req, res) => {
  const { user, baseValues } = req.body;
  const userServers = baseValues?.servers;

  const accessToken = user?.auth?.discord?.access_token;

  if (!user || !userServers || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const discordApiHandler = new DiscordApiHandler(accessToken);
    const myServers = await discordApiHandler.getMyServers();

    const newServers = myServers.filter((server) => {
      const serverIds = userServers.map((server) => server.id);
      return !serverIds.includes(server.id);
    });

    res.status(200).send({
      result: newServers.length > 0,
      newBaseValues: myServers,
      baseValuesId: "servers",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
