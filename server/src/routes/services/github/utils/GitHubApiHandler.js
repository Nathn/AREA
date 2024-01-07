const fetch = require('node-fetch');

class GitHubApiHandler {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async fetchApi(url) {
    try {
      const options = {
        headers: {
          Authorization: `token ${this.accessToken}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async fetchUser() {
    return await this.fetchApi("https://api.github.com/user");
  }

  async getPublicRepositories() {
    return await this.fetchApi("https://api.github.com/user/repos");
  }

  async getStarredPublicRepositories() {
    return await this.fetchApi("https://api.github.com/user/starred");
  }

  async getCommitsForPublicRepository(username, repository) {
    const url = `https://api.github.com/repos/${username}/${repository}/commits`;
    return await this.fetchApi(url);
  }

  async getPullRequestsForPublicRepository(username, repository) {
    const url = `https://api.github.com/repos/${username}/${repository}/pulls`;
    return await this.fetchApi(url);
  }

  async getForksForPublicRepositories(publicRepositories) {
    const forks = [];
    for (const repo of publicRepositories) {
      const url = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/forks`;
      const data = await this.fetchApi(url);
      forks.push(data);
    }
    return forks;
  }

  async getBranchesForPublicRepository(username, repository) {
    const url = `https://api.github.com/repos/${username}/${repository}/branches`;
    return await this.fetchApi(url);
  }

  async getBranchesForAllPublicRepositories(username, repositories) {
    const branches = [];
    for (let i = 0; i < repositories.length; i++) {
      const repository = repositories[i];
      const repositoryBranches = await this.getBranchesForPublicRepository(username, repository.name);
      branches.push(repositoryBranches);
    }
    return branches;
  }
}

module.exports = GitHubApiHandler;
