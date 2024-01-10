const express = require("express");
const router = express.Router();
const DeezerApiHandler = require("../utils/DeezerApiHandler");

const managePlaylists = async (userPlaylists, accessToken, action) => {
  const prevPlaylistsLength = userPlaylists?.total;

  const deezerApiHandler = new DeezerApiHandler(accessToken);
  const newUserPlaylists = await deezerApiHandler.getMyPlaylists();

  const newPlaylistsLength = newUserPlaylists?.total;

  return {
    result: action === "add" ? newPlaylistsLength > prevPlaylistsLength : action === "remove" ? newPlaylistsLength < prevPlaylistsLength : false,
    newBaseValues: newUserPlaylists,
    baseValuesId: "playlists",
    reactionNeededBaseValues: null,
  };
}

router.post("/addPlaylist", async (req, res) => {
  const { user, baseValues } = req.body;
  const userPlaylists = baseValues?.playlists;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userPlaylists || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await managePlaylists(userPlaylists, accessToken, "add");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/removePlaylist", async (req, res) => {
  const { user, baseValues } = req.body;
  const userPlaylists = baseValues?.playlists;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userPlaylists || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await managePlaylists(userPlaylists, accessToken, "remove");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
