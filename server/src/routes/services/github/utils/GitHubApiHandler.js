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

  async getStarredRepositories() {
    return await this.fetchApi("https://api.github.com/user/starred");
  }

  async getCommitsForPublicRepository(username, repository) {
    const url = `https://api.github.com/repos/${username}/${repository}/commits`;
    return await this.fetchApi(url);
  }
}

module.exports = GitHubApiHandler;
