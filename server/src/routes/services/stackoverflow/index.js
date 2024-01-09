const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.query.user_id) {
    res.status(400).send("Bad request");
    return;
  }
  const rootURL = "https://stackoverflow.com/oauth";

  const params = {
    client_id: process.env.STACKOVERFLOW_CLIENT_ID,
    scope: "no_expiry",
    redirect_uri: process.env.STACKOVERFLOW_CALLBACK_URL,
  };

  const qs = new URLSearchParams(params).toString();
  let url = `${rootURL}?${qs}`;
  url += `&state=${req.query.user_id}`;

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
