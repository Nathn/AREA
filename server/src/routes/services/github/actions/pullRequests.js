const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");
const DataFormater = require('../utils/DataFormater');

router.post("/createPullRequest", async (req, res) => {
  const { user, baseValues } = req.body;
  const userPullRequests = baseValues?.publicRepositoriesPullRequests;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userPullRequests || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newBaseValues = {};

    const githubApiHandler = new GitHubApiHandler(accessToken);
    const dataFormater = new DataFormater(githubApiHandler);

    const githubUser = await githubApiHandler.fetchUser();
    if (!githubUser) {
      res.status(200).send({
        result: result,
        newBaseValues: newBaseValues,
        baseValuesId: "",
      });
      return;
    }

    const publicRepositories = await githubApiHandler.getPublicRepositories();
    const publicRepositoriesPullRequests = await dataFormater.formatPublicRepositoriesPullRequests(publicRepositories, githubUser);
    const publicRepositoriesPullRequestsToCheck = publicRepositoriesPullRequests.map((repository) => repository?.pullRequests);

    const newPullRequests = [];

    for (let i = 0; i < publicRepositoriesPullRequestsToCheck.length; i++) {
      const pullRequests = publicRepositoriesPullRequestsToCheck[i];

      for (let j = 0; j < pullRequests.length; j++) {
        const pullRequest = pullRequests[j];

        const pullRequestInBaseValues = userPullRequests
          .map((repository) => repository.pullRequests)
          .flat()
          .map((pullRequest) => pullRequest.id)
          .includes(pullRequest.id);
        if (!pullRequestInBaseValues) {
          newPullRequests.push(pullRequest);
        }
      }
    }

    newBaseValues = publicRepositoriesPullRequests.map((repo) => ({
      repo_id: repo.repo_id,
      pullRequests: repo.pullRequests,
    }));

    let reactionNeededBaseValues = newPullRequests;

    res.status(200).send({
      result: newPullRequests.length > 0,
      newBaseValues: newBaseValues,
      baseValuesId: "publicRepositoriesPullRequests",
      reactionNeededBaseValues: reactionNeededBaseValues,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
