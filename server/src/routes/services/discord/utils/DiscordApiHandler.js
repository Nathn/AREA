const axios = require("axios");

class DiscordApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: "https://discord.com/api/v10",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getApi(url, params = {}) {
    try {
      const response = await this.api.get(url, params);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMe() {
    return await this.getApi("/users/@me");
  }

  async getMyServers() {
    return await this.getApi("/users/@me/guilds");
  }
}

module.exports = DiscordApiHandler;
