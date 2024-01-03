const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const callback = require("./callback");
const drive = require("./drive");
const gmail = require("./gmail");
const calendar = require("./calendar");

router.get("/", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  const scopes = [
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/calendar.events",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.send(url);
});

router.use("/", callback);
router.use("/drive", drive);
router.use("/gmail", gmail);
router.use("/calendar", calendar);

module.exports = router;
