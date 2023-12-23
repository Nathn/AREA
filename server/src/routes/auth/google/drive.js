const express = require("express");
const axios = require("axios");
const router = express.Router();
const { google } = require("googleapis");

router.post("/drive/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }
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
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  try {
    let response = await drive.files.list({
      fields: "nextPageToken, files(id, name)",
    });
    let files = response.data.files;
    res.status(200).send(files);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

let fileIds = new Set();
// Unused for now
const checkForNewFiles = async (drive, reaction, user) => {
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
        newFiles.forEach((file) => {
          axios.post("http://localhost:8080/auth/google/gmail/sendMail", {
            token: user?.auth?.google?.access_token,
            to: user.email,
            subject: "New file added",
            text: `A new file was added to your drive: ${file.name}`,
          });
        });
      }
      // Update the set of file IDs
      newFiles.forEach((file) => fileIds.add(file.id));
    }
  } catch (error) {
    console.log("Error checking for new files:", error);
  }
};

module.exports = router;
