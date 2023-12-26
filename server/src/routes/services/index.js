const express = require("express");
const router = express.Router();

const Service = require("@/models/Service");

const google = require("./google");

router.get("/", async (req, res) => {
  var services = await Service.find({});
  res.send(services);
});

router.use("/google", google);

module.exports = router;
