const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rootURL = "https://www.facebook.com/v10.0/dialog/oauth";

  const options = {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    scope: "email",
  };

  const qs = new URLSearchParams(options);
  const qsString = qs.toString();

  const url = rootURL + "?" + qsString;

  console.log(url);

  res.send(url);
});

router.use("/", require("./callback"));

module.exports = router;
