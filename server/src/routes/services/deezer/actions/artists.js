const express = require("express");
const router = express.Router();
const DeezerApiHandler = require("../utils/DeezerApiHandler");

const manageArtists = async (userArtists, accessToken, action) => {
  const prevArtistsLength = userArtists?.total;

  const deezerApiHandler = new DeezerApiHandler(accessToken);
  const newUserArtists = await deezerApiHandler.getMyArtists();

  const newArtistsLength = newUserArtists?.total;

  return {
    result: action === "add" ? newArtistsLength > prevArtistsLength : action === "remove" ? newArtistsLength < prevArtistsLength : false,
    newBaseValues: newUserArtists,
    baseValuesId: "artists",
    reactionNeededBaseValues: null,
  };
}

router.post("/addArtist", async (req, res) => {
  const { user, baseValues } = req.body;
  const userArtists = baseValues?.artists;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userArtists || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await manageArtists(userArtists, accessToken, "add");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/removeArtist", async (req, res) => {
  const { user, baseValues } = req.body;
  const userArtists = baseValues?.artists;

  const accessToken = user?.auth?.deezer?.access_token;

  if (!user || !userArtists || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await manageArtists(userArtists, accessToken, "remove");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
