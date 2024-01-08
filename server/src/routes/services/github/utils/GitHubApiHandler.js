const axios = require('axios');

class GitHubApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": `application/vnd.github+json`,
        "Content-Type": `application/json`,
        "X-GitHub-Api-Version": `2022-11-28`,
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

  async updateRepositoryDescription(username, repository, description) {
    const url = `/repos/${username}/${repository}`;
    const data = {
      description: description,
    };
    return await this.patchApi(url, data);
  }

  async commentPullRequest(username, repository, pullRequestNumber, comment) {
    const url = `/repos/${username}/${repository}/issues/${pullRequestNumber}/comments`;
    console.log("url", url);
    const data = {
      body: comment,
    };
    return await this.postApi(url, data);
  }
}

module.exports = GitHubApiHandler;
