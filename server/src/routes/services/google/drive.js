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
    res.status(200).send({
      files: files,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/drive/action/fileUpload", async (req, res) => {
  /*
    ACTION:
    - Returns true if there is a new file in the account compared to the baseValues
    - Returns false otherwise

    Has no side effects
  */
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.files;
  if (!user || !usefulBaseValues) {
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
  try {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    // Check if there a new file in the account compared to the usefulBaseValues
    let response = await drive.files.list({
      fields: "nextPageToken, files(id, name)",
    });
    let files = response.data.files;
    let newFiles = files.filter((file) => {
      return !usefulBaseValues.some((baseFile) => baseFile.id === file.id);
    });
    res.status(200).send({
      result: newFiles.length > 0,
      newBaseValues: files,
      baseValuesId: "files",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
