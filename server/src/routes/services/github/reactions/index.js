const express = require("express");
const router = express.Router();

const pullRequests = require("./pullRequests");
const repositories = require("./repositories");

router.use("/", pullRequests);
router.use("/", repositories);

module.exports = router;
