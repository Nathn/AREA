const express = require("express");
const router = express.Router();
const GitHubApiHandler = require("./utils/GitHubApiHandler");

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

    var publicRepositoriesCommits = await Promise.all(
      publicRepositories.map(async (repo) => {
        const commits = await githubApiHandler.getCommitsForPublicRepository(githubUser.login, repo.name);
        return {
          repo_id: repo.id,
          commits: commits,
        };
      })
    );
    publicRepositoriesCommitsToCheck = publicRepositoriesCommits.map((repository) => repository?.commits);

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

    publicRepositories = publicRepositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      commits: publicRepositoriesCommits.find((item) => item.repo_id === repo.id)?.commits,
    }));

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

module.exports = router;
