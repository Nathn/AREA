const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

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

  const listMessages = async (auth) => {
    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages;
    if (!messages.length) {
      console.log("No messages found.");
      return;
    }

    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return messageDetails.data;
      })
    );

    return messageDetails;
  };

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  let access_token = user?.auth?.google?.access_token;
  let refresh_token = user?.auth?.google?.refresh_token;
  if (!access_token || !refresh_token) {
    res.status(400).send("Bad request");
    return;
  }
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });
  if (oauth2Client.isTokenExpiring()) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let messages = await listMessages(oauth2Client);
    let newMessages = messages.filter((message) => {
      return !usefulBaseValues.some(
        (baseMessage) => baseMessage.id === message.id
      );
    });
    res.status(200).send({
      result: newMessages.length > 0,
      newBaseValues: messages,
      baseValuesId: "messagesReceived",
      reactionNeededBaseValues: null,
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

  const listMessages = async (auth) => {
    const gmail = google.gmail({ version: "v1", auth });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "from:me",
    });

    const messages = response.data.messages;
    if (!messages.length) {
      console.log("No messages found.");
      return;
    }

    const messageDetails = await Promise.all(
      messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return messageDetails.data;
      })
    );

    return messageDetails;
  };

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  let access_token = user?.auth?.google?.access_token;
  let refresh_token = user?.auth?.google?.refresh_token;
  if (!access_token || !refresh_token) {
    res.status(400).send("Bad request");
    return;
  }
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });
  if (oauth2Client.isTokenExpiring()) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let messages = await listMessages(oauth2Client);
    let newMessages = messages.filter((message) => {
      return !usefulBaseValues.some(
        (baseMessage) => baseMessage.id === message.id
      );
    });
    res.status(200).send({
      result: newMessages.length > 0,
      newBaseValues: messages,
      baseValuesId: "messagesSent",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
