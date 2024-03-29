const express = require("express");
const router = express.Router();

const User = require("@/models/User");
const Service = require("@/models/Service");

const deezer = require("./deezer");
const discord = require("./discord");
const facebook = require("./facebook");
const github = require("./github");
const google = require("./google");
const outlook = require("./outlook");
const reddit = require("./reddit");
const twitch = require("./twitch");
const yammer = require("./yammer");

router.get("/", async (req, res) => {
  var services = await Service.find({});
  // Remove route, _id and __v from each service
  services = services.map((service) => {
    return {
      name_long: service.name_long,
      name_short: service.name_short,
      type: service.type,
      actions: service.actions,
      reactions: service.reactions,
    };
  });
  res.send(services);
});

router.post("/logout/:service", async (req, res) => {
  try {
    const { service } = req.params;
    if (!req.query.user_id) {
      res.status(400).send("Bad request");
      return;
    }
    const user = await User.findOne({ _id: req.query.user_id });
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

router.use("/deezer", deezer);
router.use("/discord", discord);
router.use("/facebook", facebook);
router.use("/github", github);
router.use("/google", google);
router.use("/outlook", outlook);
router.use("/reddit", reddit);
router.use("/twitch", twitch);
router.use("/yammer", yammer);

module.exports = router;
