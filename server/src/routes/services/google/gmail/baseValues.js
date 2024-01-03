const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

// Not used yet (no actions)
router.post("/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request: no user");
    return;
  }

  const listMessagesReceived = async (auth) => {
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

  const listMessagesSent = async (auth) => {
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
    res.status(400).send("Bad request: no access token or refresh token");
    return;
  }
  oauth2Client.setCredentials({
    access_token: user.auth.google.access_token,
    refresh_token: user.auth.google.refresh_token,
  });
  if (oauth2Client.isTokenExpiring()) {
    res.status(400).send("Bad request: token expiring");
    return;
  }

  const messagesReceived = await listMessagesReceived(oauth2Client);
  const messagesSent = await listMessagesSent(oauth2Client);

  res.send({
    messagesReceived: messagesReceived,
    messagesSent: messagesSent,
  });
});

module.exports = router;
