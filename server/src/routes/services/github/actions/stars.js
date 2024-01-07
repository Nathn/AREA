const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");

router.post("/starRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const userStarredRepositories = baseValues?.starredRepositories;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userStarredRepositories || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newBaseValues = {};

    const githubApiHandler = new GitHubApiHandler(accessToken);

    const githubUser = await githubApiHandler.fetchUser();
    if (!githubUser) {
      res.status(200).send({
        result: result,
        newBaseValues: newBaseValues,
        baseValuesId: "",
      });
      return;
    }

    const starredRepositories = await githubApiHandler.getStarredPublicRepositories();

    const starredRepositoriesToCheck = starredRepositories.map((repository) => repository?.id);

    const newStarredRepositories = [];

    for (let i = 0; i < starredRepositoriesToCheck.length; i++) {
      const repositoryId = starredRepositoriesToCheck[i];

      const repositoryInBaseValues = userStarredRepositories.map((repository) => repository.id).includes(repositoryId);
      if (!repositoryInBaseValues) {
        newStarredRepositories.push(starredRepositories[i]);
      }
    }

    newBaseValues = starredRepositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));

    res.status(200).send({
      result: newStarredRepositories.length > 0,
      newBaseValues: newBaseValues,
      baseValuesId: "starredRepositories",
      reactionNeededBaseValues: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
