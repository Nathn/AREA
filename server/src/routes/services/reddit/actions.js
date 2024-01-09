const express = require("express");
const router = express.Router();
const RedditApiHandler = require("./utils/RedditApiHandler");

router.post("/upvotePost", async (req, res) => {
  const { user, baseValues } = req.body;
  const userUpvoted = baseValues?.upvoted;

  const accessToken = user?.auth?.reddit?.access_token;

  if (!user || !userUpvoted || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const prevUpvotedLength = userUpvoted.length;

    const redditApiHandler = new RedditApiHandler(accessToken);
    const me = await redditApiHandler.getMe();
    const myUsername = me?.name;

    const upvoted = await redditApiHandler.getUpvoted(myUsername);

    const newUserUpvoted = upvoted?.data?.children;
    const newUpvotedLength = newUserUpvoted.length;

    res.status(200).send({
      result: newUpvotedLength > prevUpvotedLength,
      newBaseValues: newUserUpvoted,
      baseValuesId: "upvoted",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
