const express = require("express");
const router = express.Router();

const Service = require("@/models/Service");

const google = require("./google");
const github = require("./github");

router.get("/", async (req, res) => {
  var services = await Service.find({});
  res.send(services);
});

router.use("/google", google);
router.use("/github", github);

module.exports = router;
