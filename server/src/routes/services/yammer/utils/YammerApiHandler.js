const axios = require("axios");

class YammerApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: "https://www.yammer.com/api/v1",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });
  }

  async getApi(url, params = {}) {
    try {
      const response = await this.api.get(url, { params });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async postApi(url, data = {}) {
    try {
      const response = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMe() {
    const url = "/users/current.json";

    const response = await this.getApi(url);
    return response;
  }

  async getPrivateMessages() {
    const url = "/messages/private.json";

    const response = await this.getApi(url);
    return response;
  }

  async sendMessage(message, userId) {
    const url = "/messages.json";

    const response = await this.postApi(url, {
      body: message,
      direct_to_id: userId,
    });
    return response;
  }
}

module.exports = YammerApiHandler;
