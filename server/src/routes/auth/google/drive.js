const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

router.get("/drive", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  const scopes = ["https://www.googleapis.com/auth/drive"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.send(url);
});

router.get("/drive/token", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  const { code } = req.query;
  console.log(code);
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log(tokens);
    res.send(tokens);
  } catch (error) {
    try {
      oauth2Client.setCredentials({
        refresh_token: `STORED_REFRESH_TOKEN`,
      });
      const { tokens } = await oauth2Client.refreshAccessToken();
      console.log(tokens);
      res.send(tokens);
    } catch (error) {
      console.log(error);
      res.status(400).send("Bad request");
    }
  }
});

module.exports = router;
