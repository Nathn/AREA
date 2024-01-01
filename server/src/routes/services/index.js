const express = require("express");
const router = express.Router();

const Service = require("@/models/Service");
const User = require("@/models/User");

const google = require("./google");
const github = require("./github");
const yammer = require("./yammer");

const findUserInRequestCookies = async (req) => {
  const cookiesUser = JSON.parse(req.cookies.user);
  if (!cookiesUser) return null;
  const user = await User.findOne({ uid: cookiesUser.uid });
  return user;
};

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

module.exports = router;
