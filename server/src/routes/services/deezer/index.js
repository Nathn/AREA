const express = require("express");
const router = express.Router();

const actions = require("./actions");
const baseValues = require("./baseValues");
const callback = require("./callback");

router.get("/", async (req, res) => {
  const rootURL = "https://connect.deezer.com/oauth/auth.php";
  const params = {
    app_id: process.env.DEEZER_CLIENT_ID,
    redirect_uri: process.env.DEEZER_CALLBACK_URL,
    perms: "basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history",
  };

  const qs = new URLSearchParams(params).toString();

  const url = `${rootURL}?${qs}`;

  res.send(url);
});

router.use("/action", actions);
router.use("/", baseValues);
router.use("/", callback);

module.exports = router;
