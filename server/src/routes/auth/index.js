const express = require("express");
const router = express.Router();

const google = require("./google");

router.use("/google", google);

module.exports = router;
