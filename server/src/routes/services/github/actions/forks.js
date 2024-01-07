const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

router.post("/forkRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const userForks = baseValues?.forks;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userForks || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    const prevForkSize = userForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);

    const githubApiHandler = new GitHubApiHandler(accessToken);
    const userPublicRepositories = await githubApiHandler.getPublicRepositories();
    const newUserForks = await githubApiHandler.getForksForPublicRepositories(userPublicRepositories);

    const newForkSize = newUserForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);

    res.status(200).send({
      result: newForkSize > prevForkSize,
      newBaseValues: newUserForks,
      baseValuesId: "forks",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
