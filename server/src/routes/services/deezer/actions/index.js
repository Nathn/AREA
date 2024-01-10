const express = require("express");
const router = express.Router();

const albums = require("./albums");
const artists = require("./artists");
const playlists = require("./playlists");

router.use("/", albums);
router.use("/", artists);
router.use("/", playlists);

module.exports = router;
