const express = require("express");
const router = express.Router();

const branches = require("./branches");
const commits = require("./commits");
const forks = require("./forks");
const pullRequests = require("./pullRequests");
const stars = require("./stars");

router.use("/", branches);
router.use("/", commits);
router.use("/", forks);
router.use("/", pullRequests);
router.use("/", stars);

module.exports = router;
