const express = require("express");
const router = express.Router();
const FacebookApiHandler = require("./utils/FacebookApiHandler");

router.post("/createPost", async (req, res) => {
  const { user, baseValues } = req.body;
  const userPosts = baseValues?.posts;

  const accessToken = user?.auth?.facebook?.access_token;

  if (!user || !userPosts || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const facebookApiHandler = new FacebookApiHandler(accessToken);
    const myPosts = await facebookApiHandler.getMyPosts();
    const newPosts = myPosts.data;

    res.status(200).send({
      result: newPosts.length > userPosts.length,
      newBaseValues: newPosts,
      baseValuesId: "posts",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
