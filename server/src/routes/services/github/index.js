const express = require("express");
const router = express.Router();

const callback = require("./callback");

router.use("/", callback);

module.exports = router;
