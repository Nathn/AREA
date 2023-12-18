const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.get("/gmail", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  const scopes = ["https://mail.google.com/"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.send(url);
});

router.post("/gmail/sendMail", async (req, res) => {
  const { token, subject, text, to } = req.body;

  if (!token || !subject || !text || !to) {
    res.status(400).send("Bad request");
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: token,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const message = {
    to: to,
    from: to,
    subject: subject,
    text: text,
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

  res.send("Mail sent");
});

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
    access_token: user.auth.google.gmail.access_token,
  });

  const messages = await listMessages(oauth2Client);
  res.send(messages);
});

module.exports = router;
