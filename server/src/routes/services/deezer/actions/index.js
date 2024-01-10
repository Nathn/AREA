const express = require("express");
const router = express.Router();

const albums = require("./albums");
const playlists = require("./playlists");

router.use("/", albums);
router.use("/", playlists);

module.exports = router;
