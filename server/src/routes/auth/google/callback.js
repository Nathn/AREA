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

const findUserInRequestCookies = async (req) => {
  const cookiesUser = JSON.parse(req.cookies.user);
  if (!cookiesUser) {
    return null;
  }

  const user = await User.findOne({ uid: cookiesUser.uid });
  return user;
}

const initUserGoogleAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      google: {},
    };
  }
  if (!user.auth.google) {
    user.auth.google = {};
  }

  try {
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
}

router.get("/callback", async (req, res) => {
  const { code, scope } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }

  const user = await findUserInRequestCookies(req);
  if (!user) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    const oauth2Client = initGoogleAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!user.auth || !user.auth.google)
      await initUserGoogleAuth(user);

    if (scope.includes("drive"))
      user.auth.google.drive = tokens;
    if (scope.includes("mail.google.com"))
      user.auth.google.gmail = tokens;

    await user.save();

    res.redirect(`http://localhost:8081/new`);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
