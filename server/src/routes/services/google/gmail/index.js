const express = require("express");
const router = express.Router();

const baseValues = require("./baseValues");
const actions = require("./actions");
const reactions = require("./reactions");

router.use("/", baseValues);
router.use("/action", actions);
router.use("/reaction", reactions);

module.exports = router;
