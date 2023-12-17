const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const User = require("../../../models/User");

router.get("/callback", async (req, res) => {
  // google auth callback: use the code to get the access token
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  const { code, scope } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let cookies_user = JSON.parse(req.cookies.user);
    // get the access token
    const { tokens } = await oauth2Client.getToken(code);
    // get the user info
    oauth2Client.setCredentials(tokens);
    // get db user by cookies.user.uid
    let user = await User.findOne({ uid: cookies_user.uid });
    // update the user
    if (!user.auth) {
      user.auth = {
        google: {},
      };
    }
    if (!user.auth.google) {
      user.auth.google = {};
    }
    if (scope.includes("drive")) {
      user.auth.google.drive = tokens;
    }
    if (scope.includes("mail.google.com")) {
      user.auth.google.gmail = tokens;
    }
    // save the user
    try {
      await user.save();
    } catch (error) {
      console.log("Error saving user:", error);
    }
    // redirect to the frontend
    res.redirect(`http://localhost:8081/new`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
