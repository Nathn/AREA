const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request: no user");
    return;
  }

  const listMessagesReceived = async (token, token_type) => {
    try {
      const response = await axios.get(
        "https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages",
        {
          headers: {
            Authorization: `${token_type} ${token}`,
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error("Error fetching received messages:", error);
      return null;
    }
  };

  const listMessagesSent = async (token, token_type) => {
    try {
      const response = await axios.get(
        "https://graph.microsoft.com/v1.0/me/mailfolders/sentitems/messages",
        {
          headers: {
            Authorization: `${token_type} ${token}`,
          },
        }
      );
      return response.data.value;
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      return null;
    }
  };

  let access_token = user?.auth?.outlook?.access_token;
  let token_type = user?.auth?.outlook?.token_type;
  if (!access_token || !token_type) {
    res.status(400).send("Bad request: no access token or refresh token");
    return;
  }

  const messagesReceived = await listMessagesReceived(access_token, token_type);
  const messagesSent = await listMessagesSent(access_token, token_type);
  res.send({
    messagesReceived: messagesReceived,
    messagesSent: messagesSent,
  });
});

module.exports = router;
