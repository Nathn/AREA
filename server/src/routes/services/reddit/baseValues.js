const express = require("express");
const router = express.Router();
const RedditApiHandler = require("./utils/RedditApiHandler");

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.reddit?.access_token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const redditApiHandler = new RedditApiHandler(accessToken);
    const me = await redditApiHandler.getMe();
    const myUsername = me?.name;

    const upvoted = await redditApiHandler.getUpvoted(myUsername);

    baseValues = {
      upvoted: upvoted?.data?.children,
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
