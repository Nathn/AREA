const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.post("/gmail/reaction/sendEmail", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    res.status(400).send("Bad request");
    return;
  }

  let access_token = user?.auth?.google?.access_token;
  let refresh_token = user?.auth?.google?.refresh_token;
  if (!access_token || !refresh_token) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const message = {
      to: user.email,
      from: user.email,
      subject: "AREA - Email reaction executed",
      text: "Your sendEmail reaction has been executed by the corresponding action.",
    };

    gmail.users.messages.send(
      {
        userId: "me",
        requestBody: {
          raw: Buffer.from(
            `From: ${message.from}\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`
          )
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_"),
        },
      },
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

// Not used yet
router.get("/gmail/getMails", async (req, res) => {
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

  const User = require("@/models/User");

  const user = await User.findOne({ email: "clevetepitech@gmail.com" });
  if (!user) {
    console.log("User not found");
    res.status(400).send("Bad request");
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.auth.google.access_token,
  });

  const messages = await listMessages(oauth2Client);
  res.send(messages);
});

module.exports = router;
