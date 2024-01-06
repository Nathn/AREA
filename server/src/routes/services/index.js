const express = require("express");
const router = express.Router();

const findUserInRequestCookies = require("@/utils/findUserInRequestCookies");

const Service = require("@/models/Service");

const google = require("./google");
const github = require("./github");
const yammer = require("./yammer");
const outlook = require("./outlook");

router.get("/", async (req, res) => {
  var services = await Service.find({});
  res.send(services);
});

router.post("/logout/:service", async (req, res) => {
  try {
    const { service } = req.params;
    const user = await findUserInRequestCookies(req);
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }
    if (!user.auth[service]) {
      res.status(400).send("Bad request");
      return;
    }
    user.auth[service] = null;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

router.use("/google", google);
router.use("/github", github);
router.use("/yammer", yammer);
router.use("/outlook", outlook);

module.exports = router;
