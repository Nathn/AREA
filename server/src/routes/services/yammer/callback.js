const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("@/models/User");

const initUserYammerAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      yammer: {},
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

  const code = req.query.code;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const response = await axios.post(
      "https://www.yammer.com/oauth2/access_token",
      {
        client_id: process.env.YAMMER_CLIENT_ID,
        client_secret: process.env.YAMMER_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }
    );

    const accessTokens = response.data.access_token;

    if (!user.auth) await initUserYammerAuth(user);

    user.auth.yammer = accessTokens;
    await user.save();

    // Redirect or send a response based on the success of the authentication
    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    // Handle errors, log them, and redirect to an error page
    console.error("Yammer authentication error:", error.message);
    res.status(400).send("Bad request in Yammer callback");
  }
});

module.exports = router;
