const express = require("express");
const router = express.Router();

const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }

  const rootURL = "https://www.reddit.com/api/v1/authorize";
  const params = {
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.REDDIT_CALLBACK_URL,
    duration: "permanent",
    scope: "account creddits edit flair history identity livemanage modconfig modcontributors modflair modlog modothers modposts modself modwiki mysubreddits privatemessages read report save structuredstyles submit subscribe vote wikiedit wikiread",
  };

  const qs = new URLSearchParams(params).toString();

  let url = `${rootURL}?${qs}`;
  url += `&state=${req.query.user_id}`;

  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);

module.exports = router;
