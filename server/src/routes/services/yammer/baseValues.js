const express = require("express");
const router = express.Router();
const YammerApiHandler = require("./utils/YammerApiHandler");

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.yammer?.token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const yammerApiHandler = new YammerApiHandler(accessToken);
    const privateMessages = await yammerApiHandler.getPrivateMessages();

    baseValues = {
      privateMessages: privateMessages,
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
