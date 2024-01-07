const express = require("express");
const router = express.Router();

const repositories = require("./repositories");

router.use("/", repositories);

module.exports = router;
