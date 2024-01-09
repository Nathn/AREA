const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("@/models/User");

const initUserAuth = async (user) => {
  try {
    if (!user.auth) {
      user.auth = {
        outlook: {},
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
    const params = new URLSearchParams();
    params.append("client_id", process.env.OUTLOOK_CLIENT_ID);
    params.append("client_secret", process.env.OUTLOOK_CLIENT_SECRET);
    params.append("code", code);
    params.append("grant_type", "authorization_code");
    params.append("redirect_uri", process.env.OUTLOOK_CALLBACK_URL);
    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const response = await axios
      .post(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        params,
        config
      )
      .catch((err) => {
        console.log(err);
      });
    const accessTokens = response.data;
    if (!user.auth) await initUserAuth(user);
    user.auth.outlook = accessTokens;
    await user.save();
    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
