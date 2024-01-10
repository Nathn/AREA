const express = require("express");
const router = express.Router();
const DeezerApiHandler = require("./utils/DeezerApiHandler");

router.post("/addAlbum", async (req, res) => {
  const { user, baseValues } = req.body;
  const userAlbums = baseValues?.albums;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userAlbums || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const prevAlbumsLength = userAlbums?.total;
    console.log("prevAlbumsLength", prevAlbumsLength);

    const deezerApiHandler = new DeezerApiHandler(accessToken);
    const albums = await deezerApiHandler.getMyAlbums();

    const newUserAlbums = albums;

    const newAlbumsLength = newUserAlbums?.total;
    console.log("newAlbumsLength", newAlbumsLength);

    res.status(200).send({
      result: newAlbumsLength > prevAlbumsLength,
      newBaseValues: newUserAlbums,
      baseValuesId: "albums",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
