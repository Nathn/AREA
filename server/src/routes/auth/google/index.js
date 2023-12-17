const express = require("express");
const router = express.Router();

const callback = require("./callback");
const drive = require("./drive");

router.use("/", callback);

router.use("/", drive);

module.exports = router;
