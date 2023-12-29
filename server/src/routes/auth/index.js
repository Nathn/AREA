const express = require("express");
const router = express.Router();

const github = require("./github");
const google = require("./google");

router.use("/github", github);
router.use("/google", google);

module.exports = router;
