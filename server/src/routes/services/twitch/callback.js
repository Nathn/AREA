const express = require("express");
const router = express.Router();
const axios = require("axios");

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

const initUserAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      twitch: {},
    };
  }

  try {
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

router.get("/callback", async (req, res) => {
  const user = await findUserInRequestCookies(req);
  if (!user) {
    res.status(400).send("User not found");
    return;
  }

  const { code } = req.query;
  if (!code) {
    res.status(400).send("Bad request");
    return;
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.TWITCH_CLIENT_ID);
  params.append("client_secret", process.env.TWITCH_CLIENT_SECRET);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", process.env.TWITCH_CALLBACK_URL);
  params.append("scope", "channel:read:subscriptions user:read:follows");

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const response = await axios
    .post("https://id.twitch.tv/oauth2/token", params, config)
    .catch((err) => {
      console.log(err);
    });

  try {
    const data = response.data;

    if (!user.auth) await initUserAuth(user);
    user.auth.twitch = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
