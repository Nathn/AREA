const express = require("express");
const axios = require("axios");

const router = express.Router();

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

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
  const code = req.query.code;
  try {
    let data = `client_id=${process.env.DISCORD_CLIENT_ID}&client_secret=${process.env.DISCORD_CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&scope=identify`;
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
    const user = await findUserInRequestCookies(req);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    if (!user.auth) await initUserAuth(user);
    user.auth.discord = accessTokens;
    await user.save();
    res.redirect(`${process.env.FRONT_URL}/new`);
  } catch (error) {
    res.status(400).send("Bad request");
  }
});

module.exports = router;
