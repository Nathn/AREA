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

module.exports = router;
