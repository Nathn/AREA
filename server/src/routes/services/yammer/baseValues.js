const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    access_token = user?.auth?.yammer?.token;
    if (!access_token) {
      res.status(400).send("Bad request");
      return;
    }
    // Make a request to the Yammer API to fetch private messages
    const response = await axios.get("https://www.yammer.com/api/v1/messages/private.json", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Extract relevant information from the API response and build baseValues
    const messages = response.data.messages;
    let baseValues = {};

    // Customize the logic to build baseValues based on your requirements
    messages.forEach((message) => {
      // Example: store the message body in baseValues
      baseValues[message.id] = message.body.plain;
    });

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
