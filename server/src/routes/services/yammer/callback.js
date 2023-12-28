const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("@/models/User");

  const findUserInRequestCookies = async (req) => {
    const cookiesUser = JSON.parse(req.cookies.user);
    if (!cookiesUser) {
      return null;
    }

    const user = await User.findOne({ uid: cookiesUser.uid });
    return user;
  };

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
        }

router.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post("https://www.yammer.com/oauth2/access_token", {
      client_id: process.env.YAMMER_CLIENT_ID,
      client_secret: process.env.YAMMER_CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
    });

    const accessTokens = response.data.access_token;

    const user = await findUserInRequestCookies(req);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    if (!user.auth) await initUserYammerAuth(user);

    user.auth.yammer = accessTokens;
    await user.save();

    // Redirect or send a response based on the success of the authentication
    res.redirect("http://localhost:8081/new");
  } catch (error) {
    // Handle errors, log them, and redirect to an error page
    console.error("Yammer authentication error:", error.message);
    res.status(400).send("Bad request in Yammer callback");
  }
});

module.exports = router;
