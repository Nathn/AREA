const axios = require("axios");

class FacebookApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: "https://graph.facebook.com/v13.0",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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

  async getMe() {
    const url = "/me";

    const params = {
      fields: "id,name,email,picture",
    };

    const response = await this.getApi(url, params);
    return response;
  }

  async getMyPosts() {
    const url = "/me/posts";

    const params = {
      fields: "id,message,created_time,attachments",
    };

    const response = await this.getApi(url, params);
    return response;
  }
}

module.exports = FacebookApiHandler;
