const express = require("express");
const router = express.Router();
const GitHubApiHandler = require('./utils/GitHubApiHandler');

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

    const githubUser = await githubApiHandler.fetchUser();
    if (!githubUser) {
      res.status(200).send(baseValues);
      return;
    }

    const publicRepositories = await githubApiHandler.getPublicRepositories();
    const starredRepositories = await githubApiHandler.getStarredRepositories();

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
      user: {
        id: githubUser.id,
        name: githubUser.name,
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        url: githubUser.html_url,
      },
      publicRepositories: publicRepositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        commits: publicRepositoriesCommits.find(item => item.repo_id === repo.id)?.commits,
      })),
      starredRepositories: starredRepositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
      })),
    };

    res.status(200).send(baseValues);
  } catch (error) {
    console.log(error);
    res.status(400).send("Bad request");
  }
});

module.exports = router;
