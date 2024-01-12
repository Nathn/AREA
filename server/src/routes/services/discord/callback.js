const express = require("express");
const axios = require("axios");

const router = express.Router();

const User = require("@/models/User");

const initUserAuth = async (user) => {
  try {
    if (!user.auth) {
      user.auth = {
        discord: {},
      };
    }
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
  try {
    let qs = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.DISCORD_CALLBACK_URL,
      scope: "identify guilds",
    });
    let data = qs.toString();

    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const response = await axios
      .post("https://discord.com/api/oauth2/token", data, {
        headers: headers,
      })
      .catch((err) => {
        console.log(err);
      });
    const accessTokens = response.data;
    if (!user.auth) await initUserAuth(user);
    user.auth.discord = accessTokens;
    await user.save();
    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
