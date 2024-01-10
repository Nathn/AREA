const express = require("express");
const router = express.Router();
const DeezerApiHandler = require("./utils/DeezerApiHandler");

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.deezer?.access_token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const deezerApiHandler = new DeezerApiHandler(accessToken);
    const albums = await deezerApiHandler.getMyAlbums();

    baseValues = {
      albums: albums,
    }

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
