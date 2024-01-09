const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const User = require("@/models/User");

const initGoogleAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

const initUserGoogleAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      google: {},
    };
  }

  try {
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

router.get("/callback", async (req, res) => {
  const state = req.query.state;
  if (!state) {
    res.status(400).send("Bad request");
    return;
  }
  const user = await User.findOne({ _id: state });
  if (!user) {
    res.status(400).send("User not found");
    return;
  }
  const { code, scope } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    const oauth2Client = initGoogleAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!user.auth) await initUserGoogleAuth(user);

    user.auth.google = tokens;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
