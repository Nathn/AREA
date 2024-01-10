const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("@/models/User");

const initUserDeezerAuth = async (user) => {
  if (!user.auth) {
    user.auth = {
      deezer: {},
    };
  }

  if (!user.auth.deezer) {
    user.auth.deezer = {};
  }

  try {
    await user.save();
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

router.get("/callback", async (req, res) => {
  const state = req.query.state;
  console.log("state", state);
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
    app_id: process.env.DEEZER_CLIENT_ID,
    secret: process.env.DEEZER_CLIENT_SECRET,
    code,
    output: "json",
  };

  const response = await axios.get(
    "https://connect.deezer.com/oauth/access_token.php",
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
    if (!user.auth) await initUserDeezerAuth(user);

    user.auth.deezer = data;

    await user.save();

    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    console.error("Reddit authentication error:", error.message);
    res.status(400).send("Bad request in Reddit callback");
  }
});

module.exports = router;
