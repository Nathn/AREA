const express = require("express");
const router = express.Router();

const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");

router.get("/", async (req, res) => {
  const rootURL = "https://www.facebook.com/v10.0/dialog/oauth";

  const options = {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    scope: "email,public_profile,user_posts",
  };

  const qs = new URLSearchParams(options);
  const qsString = qs.toString();

  const url = rootURL + "?" + qsString;

  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);

module.exports = router;
