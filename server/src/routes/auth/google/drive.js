const express = require("express");
const axios = require("axios");
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

let fileIds = new Set();
const checkForNewFiles = async (drive, reaction) => {
  try {
    let response = await drive.files.list({
      fields: "nextPageToken, files(id, name)",
    });
    let files = response.data.files;

    // Check if there are any new files
    let newFiles = files.filter((file) => !fileIds.has(file.id));

    if (newFiles.length > 0) {
      console.log("New files added:", newFiles);
      if (reaction === "gmail") {
        // send GET request to /auth/google/gmail/sendMail
        axios.get("http://localhost:8080/auth/google/gmail/sendMail");
      }
      // Update the set of file IDs
      newFiles.forEach((file) => fileIds.add(file.id));
    }
  } catch (error) {
    console.log("Error checking for new files:", error);
  }
};

router.post("/drive/:reaction", async (req, res) => {
  const { reaction } = req.params;
  const { access_token, refresh_token } = req.body;
  if (!access_token || !refresh_token) {
    res.status(400).send("Bad request");
    return;
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  oauth2Client.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,
  });

  // Check if token is expired
  if (oauth2Client.isTokenExpiring()) {
    try {
      const newTokens = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(newTokens);
      // TODO: save new tokens in database
    } catch (error) {
      console.log("Error refreshing access token:", error);
      res.status(500).send("Error refreshing access token");
      return;
    }
  }

  const drive = google.drive({ version: "v3", auth: oauth2Client });
  try {
    let response = await drive.files.list({
      fields: "nextPageToken, files(id, name)",
    });
    let files = response.data.files;
    files.forEach((file) => fileIds.add(file.id));
    setInterval(checkForNewFiles, 5000, drive, reaction);
    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
