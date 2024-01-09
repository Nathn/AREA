const express = require("express");
const router = express.Router();
const axios = require("axios");

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

const initUserRedditAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      reddit: {},
    };
  }

  if (!user.auth.reddit) {
    user.auth.reddit = {};
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

  const params = {
    client_id: process.env.REDDIT_CLIENT_ID,
    client_secret: process.env.REDDIT_CLIENT_SECRET,
    redirect_uri: process.env.REDDIT_CALLBACK_URL,
    code,
    grant_type: "authorization_code",
  };

  const response = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
    null,
    {
      params,
      auth: {
        username: process.env.REDDIT_CLIENT_ID,
        password: process.env.REDDIT_CLIENT_SECRET,
      },
    }
  );

  const data = response.data;
  const { access_token } = data;
  if (!access_token) {
    res.status(400).send("Bad request");
    return;
  }

  try {
    if (!user.auth) await initUserRedditAuth(user);

    user.auth.reddit = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.error("Reddit authentication error:", error.message);
    res.status(400).send("Bad request in Reddit callback");
  }
});

module.exports = router;
