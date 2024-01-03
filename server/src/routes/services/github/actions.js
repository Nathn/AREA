const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("./utils/GitHubApiHandler");
const DataFormater = require('./utils/DataFormater');

router.post("/pushCommit", async (req, res) => {
  const { user, baseValues } = req.body;
  const userCommits = baseValues?.publicRepositories?.map((repository) => repository?.commits);
  const accesToken = user?.auth?.github?.access_token;

  if (!user || !userCommits || !accesToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newBaseValues = {};

    const githubApiHandler = new GitHubApiHandler(accesToken);
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

    var publicRepositories = await githubApiHandler.getPublicRepositories();
    var publicRepositoriesCommits = await dataFormater.formatPublicRepositoriesCommits(publicRepositories, githubUser);
    var publicRepositoriesCommitsToCheck = publicRepositoriesCommits.map((repository) => repository?.commits);

    var newCommits = [];

    for (let i = 0; i < publicRepositoriesCommitsToCheck.length; i++) {
      const oldSha = userCommits[i].map((commit) => commit.sha);
      if (!oldSha) {
        continue;
      }

      for (let j = 0; j < publicRepositoriesCommitsToCheck[i].length; j++) {
        const commitSha = publicRepositoriesCommitsToCheck[i][j].sha;

        const commitInBaseValues = oldSha.includes(commitSha);
        if (!commitInBaseValues) {
          newCommits.push(publicRepositoriesCommitsToCheck[i][j]);
        }
      }
    }

    publicRepositories = await dataFormater.formatPublicRepositoriesData(publicRepositoriesCommits);

    res.status(200).send({
      result: newCommits.length > 0,
      newBaseValues: publicRepositories,
      baseValuesId: "publicRepositories",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/createPullRequest", async (req, res) => {
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.publicRepositoriesPullRequests;
  const accesToken = user?.auth?.github?.access_token;

  if (!user || !usefulBaseValues || !accesToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newBaseValues = {};

    const githubApiHandler = new GitHubApiHandler(accesToken);
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

        const pullRequestInBaseValues = usefulBaseValues
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

    res.status(200).send({
      result: newPullRequests.length > 0,
      newBaseValues: newBaseValues,
      baseValuesId: "publicRepositoriesPullRequests",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
