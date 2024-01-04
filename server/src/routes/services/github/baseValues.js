const express = require("express");
const router = express.Router();
const GitHubApiHandler = require('./utils/GitHubApiHandler');
const DataFormater = require('./utils/DataFormater');

router.post("/baseValues", async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      res.status(400).send("Bad request");
      return;
    }

    const accessToken = user?.auth?.github?.access_token;
    if (!accessToken) {
      res.status(400).send("Bad request");
      return;
    }

    let baseValues = {};

    const githubApiHandler = new GitHubApiHandler(accessToken);
    const dataFormater = new DataFormater(githubApiHandler);

    const githubUser = await githubApiHandler.fetchUser();
    if (!githubUser) {
      res.status(200).send(baseValues);
      return;
    }

    const publicRepositories = await githubApiHandler.getPublicRepositories();
    const starredRepositories = await githubApiHandler.getStarredPublicRepositories();
    const publicRepositoriesPullRequests = await dataFormater.formatPublicRepositoriesPullRequests(publicRepositories, githubUser);
    const publicRepositoriesCommits = await Promise.all(
      publicRepositories.map(async repo => {
      const commits = await githubApiHandler.getCommitsForPublicRepository(githubUser.login, repo.name);
        return {
          repo_id: repo.id,
          commits: commits,
        };
      })
    );

    baseValues = {
      user: dataFormater.formatUser(githubUser),
      publicRepositories: dataFormater.formatPublicRepositoriesData(publicRepositories, publicRepositoriesCommits),
      starredRepositories: dataFormater.formatPublicStarredRepositoriesData(starredRepositories),
      publicRepositoriesPullRequests: publicRepositoriesPullRequests,
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
