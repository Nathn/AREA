const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/channelFollowed", async (req, res) => {
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.following;
  if (!user || !usefulBaseValues) {
    res.status(400).send("Bad request: no or invalid baseValues");
    return;
  }

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
    res.status(400).send("Bad request: no access token");
    return;
  }

  try {
    const following = await getTwitchFollows(access_token);
    let newFollows = following.filter((channel) => {
      return !usefulBaseValues.some(
        (baseChannel) => baseChannel.broadcaster_id === channel.broadcaster_id
      );
    });
    res.status(200).send({
      result: newFollows.length > 0,
      newBaseValues: following,
      baseValuesId: "following",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
