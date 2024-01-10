const express = require("express");
const router = express.Router();
const DeezerApiHandler = require("../utils/DeezerApiHandler");

const manageAlbums = async (userAlbums, accessToken, action) => {
  const prevAlbumsLength = userAlbums?.total;

  const deezerApiHandler = new DeezerApiHandler(accessToken);
  const newUserAlbums = await deezerApiHandler.getMyAlbums();

  const newAlbumsLength = newUserAlbums?.total;

  return {
    result: action === "add" ? newAlbumsLength > prevAlbumsLength : action === "remove" ? newAlbumsLength < prevAlbumsLength : false,
    newBaseValues: newUserAlbums,
    baseValuesId: "albums",
    reactionNeededBaseValues: null,
  };
}

router.post("/addAlbum", async (req, res) => {
  const { user, baseValues } = req.body;
  const userAlbums = baseValues?.albums;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userAlbums || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await manageAlbums(userAlbums, accessToken, "add");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/removeAlbum", async (req, res) => {
  const { user, baseValues } = req.body;
  const userAlbums = baseValues?.albums;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userAlbums || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await manageAlbums(userAlbums, accessToken, "remove");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
