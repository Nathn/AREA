const axios = require("axios");

class DeezerApiHandler {
  constructor(accessToken) {
    this.api = axios.create({
      baseURL: "https://api.deezer.com",
      timeout: 10000,
    });

    this.accessToken = accessToken;
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
    const url = "/user/me";
    const params = {
      params: {
        access_token: this.accessToken,
      },
    };

    return await this.getApi(url, params);
  }

  async getMyAlbums() {
    const url = "/user/me/albums";
    const params = {
      params: {
        access_token: this.accessToken,
      },
    };

    return await this.getApi(url, params);
  }

  async getMyPlaylists() {
    const url = "/user/me/playlists";
    const params = {
      params: {
        access_token: this.accessToken,
      },
    };

    return await this.getApi(url, params);
  }
}

module.exports = DeezerApiHandler;

