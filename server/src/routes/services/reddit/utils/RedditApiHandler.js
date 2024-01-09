const axios = require("axios");

class RedditApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: "https://oauth.reddit.com",
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });
  }

  async getApi(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMe() {
    return await this.getApi("/api/v1/me");
  }

  async getUpvoted(username) {
    return await this.getApi(`/user/${username}/upvoted`);
  }
}

module.exports = RedditApiHandler;
