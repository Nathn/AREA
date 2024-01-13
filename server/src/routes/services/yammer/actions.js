const express = require("express");
const router = express.Router();
const YammerApiHandler = require("./utils/YammerApiHandler");

router.post("/sendMessage", async (req, res) => {
  const { user, baseValues } = req.body;
  const userPrivateMessages = baseValues?.privateMessages?.messages;

  const accessToken = user?.auth?.yammer?.token;

  if (!user || !userPrivateMessages || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const lastMessage = userPrivateMessages[0];

    const yammerApiHandler = new YammerApiHandler(accessToken);
    const privateMessages = await yammerApiHandler.getPrivateMessages();

    const newLastMessage = privateMessages?.messages[0];

    res.status(200).send({
      result: lastMessage?.id !== newLastMessage?.id,
      newBaseValues: privateMessages,
      baseValuesId: "privateMessages",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
