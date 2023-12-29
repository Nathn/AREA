const express = require("express");
const router = express.Router();

function requestLoggerMiddleware(req, res, next) {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
}

router.use(requestLoggerMiddleware);

const about = require("./about");
const users = require("./users");
const actionreactions = require("./actionreactions");
const services = require("./services");

router.use("/", about);
router.use("/", users);
router.use("/", actionreactions);
router.use("/services", services);

router.get("/", (req, res) => {
  res.send("Pong !");
});

module.exports = router;
