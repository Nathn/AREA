const express = require("express");
const router = express.Router();

const callback = require("./callback");
const baseValues = require("./baseValues");
const actions = require("./actions");
const reactions = require("./reactions");

router.get("/", async (req, res) => {
  const rootURL = "https://github.com/login/oauth/authorize";

  const options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: "user public_repo",
  };

  const qs = new URLSearchParams(options);

  var qsString = qs.toString();
  const qsArray = qsString.split('&');
  for (let i = 0; i < qsArray.length; i++) {
    if (qsArray[i].includes('redirect_uri')) {
      qsArray.splice(i, 1);
    }
  }
  qsString = qsArray.join('&');

  const url = rootURL + "?" + qsString;

  res.send(url);
});

router.use("/", callback);
router.use("/", baseValues);
router.use("/action", actions);
router.use("/reaction", reactions);

module.exports = router;
