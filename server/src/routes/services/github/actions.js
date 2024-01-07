const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("./utils/GitHubApiHandler");
const DataFormater = require('./utils/DataFormater');

router.post("/pushCommit", async (req, res) => {
  const { user, baseValues } = req.body;
  const userCommits = baseValues?.publicRepositories?.map((repository) => repository?.commits);

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userCommits || !accessToken) {
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

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !usefulBaseValues || !accessToken) {
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

router.post("/starRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const usefulBaseValues = baseValues?.starredRepositories;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !usefulBaseValues || !accessToken) {
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

      const repositoryInBaseValues = usefulBaseValues.map((repository) => repository.id).includes(repositoryId);
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
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

router.post("/forkRepo", async (req, res) => {
  const { user, baseValues } = req.body;
  const userForks = baseValues?.forks;

  const accessToken = user?.auth?.github?.access_token;

  if (!user || !userForks || !accessToken) {
    res.status(400).send("Bad request");
    return;
  }
  try {
    let result = false;
    let newUserForks = {};

    const prevForkSize = userForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);
    console.log(prevForkSize);

    const githubApiHandler = new GitHubApiHandler(accessToken);
    const userPublicRepositories = await githubApiHandler.getPublicRepositories();
    const newForks = await githubApiHandler.getForksForPublicRepositories(userPublicRepositories);

    const newForkSize = newForks.map((repository) => repository.length).reduce((a, b) => a + b, 0);

    res.status(200).send({
      result: newForkSize > prevForkSize,
      newBaseValues: newForks,
      baseValuesId: "forks",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
