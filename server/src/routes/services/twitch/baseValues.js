const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/baseValues", async (req, res) => {
  const { user } = req.body;
  if (!user) {
    res.status(400).send("Bad request: no user");
    return;
  }

  const validateToken = async (token) => {
    try {
      const response = await axios.get("https://id.twitch.tv/oauth2/validate", {
        headers: {
          Authorization: `OAuth ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error validating token:", error);
      return null;
    }
  };

  const refreshToken = async (refresh_token) => {
    try {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        {},
        {
          params: {
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: process.env.TWITCH_CLIENT_ID,
            client_secret: process.env.TWITCH_CLIENT_SECRET,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const getTwitchFollows = async (token) => {
    try {
      // Get user ID
      let userResponse = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      });

      let userId = userResponse.data.data[0].id;

      // Get follows
      const response = await axios.get(
        "https://api.twitch.tv/helix/channels/followed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
          },
          params: {
            user_id: userId,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching Twitch follows:", error);
      return null;
    }
  };

  let access_token = user?.auth?.twitch?.access_token;
  if (!access_token) {
    res.status(400).send("Bad request: no access token or refresh token");
    return;
  }
  let isTokenValid = await validateToken(access_token);
  if (!isTokenValid) {
    let refresh_token = user?.auth?.twitch?.refresh_token;
    if (!refresh_token) {
      res.status(400).send("Bad request: no refresh token");
      return;
    }
    let tokenData = await refreshToken(refresh_token);
    if (!tokenData) {
      res.status(400).send("Bad request: no token data");
      return;
    }
    access_token = tokenData.access_token;
    user.auth.twitch.access_token = access_token;
    await user.save();
  }
  const following = await getTwitchFollows(access_token);
  res.send({
    following: following,
  });
});

module.exports = router;
