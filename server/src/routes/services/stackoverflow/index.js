const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rootURL = "https://stackoverflow.com/oauth";

  const params = {
    client_id: process.env.STACKOVERFLOW_CLIENT_ID,
    scope: "no_expiry",
    redirect_uri: process.env.STACKOVERFLOW_CALLBACK_URL,
  };

  const qs = new URLSearchParams(params).toString();
  const url = `${rootURL}?${qs}`;

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
