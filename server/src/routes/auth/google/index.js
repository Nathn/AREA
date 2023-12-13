const express = require("express");
const router = express.Router();

const drive = require("./drive");

router.use("/", drive);

module.exports = router;
