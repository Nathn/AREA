const express = require("express");
const router = express.Router();
const axios = require("axios");

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

const initUserStackoverflowAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      stackoverflow: {},
    };
  }

  if (!user.auth.stackoverflow) {
    user.auth.stackoverflow = {};
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

  const qs = {
    client_id: process.env.STACKOVERFLOW_CLIENT_ID,
    client_secret: process.env.STACKOVERFLOW_CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.STACKOVERFLOW_CALLBACK_URL,
  };

  const response = await axios.post("https://stackoverflow.com/oauth/access_token/json", qs, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = response.data;
  const { access_token } = data;
  if (!access_token) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    if (!user.auth) await initUserStackoverflowAuth(user);

    user.auth.stackoverflow = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.error("Stack Overflow authentication error:", error.message);
    res.status(400).send("Bad request in Stack Overflow callback");
  }
});

module.exports = router;
