const axios = require('axios');

class GitHubApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
  }

  async getApi(url) {
    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async postApi(url, data) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async patchApi(url, data) {
    try {
      const response = await this.api.patch(url, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async fetchUser() {
    return await this.getApi("/user");
  }

  async getPublicRepositories() {
    return await this.getApi("/user/repos");
  }

  async getStarredPublicRepositories() {
    return await this.getApi("/user/starred");
  }

  async getCommitsForPublicRepository(username, repository) {
    const url = `/repos/${username}/${repository}/commits`;
    return await this.getApi(url);
  }

  async getPullRequestsForPublicRepository(username, repository) {
    const url = `/repos/${username}/${repository}/pulls`;
    return await this.getApi(url);
  }

  async getForksForPublicRepositories(publicRepositories) {
    const forks = [];
    for (const repo of publicRepositories) {
      const url = `/repos/${repo.owner.login}/${repo.name}/forks`;
      const data = await this.getApi(url);
      forks.push(data);
    }
    return forks;
  }

  async getBranchesForPublicRepository(username, repository) {
    const url = `/repos/${username}/${repository}/branches`;
    return await this.getApi(url);
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
