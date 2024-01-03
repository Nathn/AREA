const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/reactionMessage", async (req, res) => {
  // Replace reactionName with your reaction name
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const access_token = user?.auth?.yammer?.token;
    if (!access_token) {
      res.status(400).send("Bad request");
      return;
    }
    // Make a request to the Yammer API to get my id : https://www.yammer.com/api/v1/users/current.json
    const response = await axios.get("https://www.yammer.com/api/v1/users/current.json", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    const myId = response.data.id;
    // Make a request to the Yammer API to send a message to myself
    const msg = await axios.post("https://www.yammer.com/api/v1/messages.json", {
        body: "This is a reaction !",
        direct_to_id: myId,
        }, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    res.status(200).send("OK");

  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;