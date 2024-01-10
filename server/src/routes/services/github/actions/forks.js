const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

const handleForkRepo = async (userForks, accessToken, action) => {
  const prevForkSize = userForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);

  const githubApiHandler = new GitHubApiHandler(accessToken);
  const userPublicRepositories = await githubApiHandler.getPublicRepositories();
  const newUserForks = await githubApiHandler.getForksForPublicRepositories(userPublicRepositories);

  const newForkSize = newUserForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);

  return {
    result: action === "add" ? newForkSize > prevForkSize : action === "remove" ? newForkSize < prevForkSize : false,
    newBaseValues: newUserForks,
    baseValuesId: "forks",
    reactionNeededBaseValues: null,
  };
}

router.post("/forkRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const userForks = baseValues?.forks;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userForks || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await handleForkRepo(userForks, accessToken, "add");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/unforkRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const userForks = baseValues?.forks;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userForks || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const result = await handleForkRepo(userForks, accessToken, "remove");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
