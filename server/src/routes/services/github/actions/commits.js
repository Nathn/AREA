const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("../utils/GitHubApiHandler");
const DataFormater = require('../utils/DataFormater');

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

    publicRepositories = await dataFormater.formatPublicRepositoriesData(publicRepositories, publicRepositoriesCommits);

    let reactionNeededBaseValues = [];
    for (let i = 0; i < newCommits.length; i++) {
      const commitSha = newCommits[i].sha;
      for (let j = 0; j < publicRepositoriesCommitsToCheck.length; j++) {
        const commitInBaseValues = publicRepositoriesCommitsToCheck[j].map((commit) => commit.sha).includes(commitSha);
        if (commitInBaseValues) {
          reactionNeededBaseValues.push({
            repository: publicRepositories[j],
            commit: newCommits[i],
          });
        }
      }
    }

    res.status(200).send({
      result: newCommits.length > 0,
      newBaseValues: publicRepositories,
      baseValuesId: "publicRepositories",
      reactionNeededBaseValues: reactionNeededBaseValues,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
