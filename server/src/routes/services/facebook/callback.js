const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("@/models/User");

const initUserFacebookAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      facebook: {},
    };
  }

  if (!user.auth.facebook) {
    user.auth.facebook = {};
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

  const { code } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }

  const params = {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    code,
  };

  const response = await axios.get(
    "https://graph.facebook.com/v10.0/oauth/access_token",
    {
      params,
    }
  );

  const data = response.data;
  const { access_token } = data;
  if (!access_token) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    if (!user.auth) await initUserFacebookAuth(user);

    user.auth.facebook = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.error("Facebook authentication error:", error.message);
    res.status(400).send("Bad request in Facebook callback");
  }
});

module.exports = router;
