const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/emailReceived", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new email in
      the inbox compared to the baseValues.messagesReceived
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.messagesReceived;
  if (!user || !usefulBaseValues) {
    res.status(400).send("Bad request: no or invalid baseValues");
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

  let access_token = user?.auth?.outlook?.access_token;
  let token_type = user?.auth?.outlook?.token_type;
  if (!access_token || !token_type) {
    res.status(400).send("Bad request: no access token or refresh token");
    return;
  }

  try {
    const messages = await listMessagesReceived(access_token, token_type);
    let newMessages = messages.filter((message) => {
      return !usefulBaseValues.some(
        (baseMessage) => baseMessage.id === message.id
      );
    });
    res.status(200).send({
      result: newMessages.length > 0,
      newBaseValues: messages,
      baseValuesId: "messagesReceived",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/emailSent", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new email in
      the sent folder compared to the baseValues.messagesSent
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.messagesSent;
  if (!user || !usefulBaseValues) {
    res.status(400).send("Bad request: no or invalid baseValues");
    return;
  }

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

  try {
    const messages = await listMessagesSent(access_token, token_type);
    let newMessages = messages.filter((message) => {
      return !usefulBaseValues.some(
        (baseMessage) => baseMessage.id === message.id
      );
    });
    res.status(200).send({
      result: newMessages.length > 0,
      newBaseValues: messages,
      baseValuesId: "messagesSent",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
