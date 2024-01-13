const express = require("express");
const router = express.Router();
const YammerApiHandler = require("./utils/YammerApiHandler");

router.post("/reactionMessage", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const accessToken = user?.auth?.yammer?.token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    const yammerApiHandler = new YammerApiHandler(accessToken);
    const me = await yammerApiHandler.getMe();

    await yammerApiHandler.sendMessage("This is a reaction !", me?.id);

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;