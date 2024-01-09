const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }
  console.log("client id:", process.env.REDDIT_CLIENT_ID);
  console.log("callback url:", process.env.REDDIT_CALLBACK_URL);
  const rootURL = "https://www.reddit.com/api/v1/authorize";
  const params = {
    client_id: process.env.REDDIT_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.REDDIT_CALLBACK_URL,
    duration: "permanent",
    scope: "identity",
  };

  const qs = new URLSearchParams(params).toString();

  let url = `${rootURL}?${qs}`;
  url += `&state=${req.query.user_id}`;

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
