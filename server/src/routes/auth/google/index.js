const express = require("express");
const router = express.Router();

const callback = require("./callback");
const drive = require("./drive");
const gmail = require("./gmail");

router.use("/", callback);
router.use("/", drive);
router.use("/", gmail);

module.exports = router;
