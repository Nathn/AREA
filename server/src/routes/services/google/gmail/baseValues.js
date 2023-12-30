const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

// Not used yet (no actions)
router.post("/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request");
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

  oauth2Client.setCredentials({
    access_token: user.auth.google.access_token,
  });

  const messages = await listMessages(oauth2Client);
  res.send({
    messages: messages,
  });
});

module.exports = router;
