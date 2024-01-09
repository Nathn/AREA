const express = require("express");
const router = express.Router();
const FacebookApiHandler = require("./utils/FacebookApiHandler");

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.facebook?.access_token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const facebookApiHandler = new FacebookApiHandler(accessToken);
    const myPosts = await facebookApiHandler.getMyPosts();

    baseValues = {
      posts: myPosts.data,
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
