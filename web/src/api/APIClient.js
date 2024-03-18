import axios from "axios";

class Client {
  constructor() {
    this.serverAPI = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
    });

    this.mobileAPI = axios.create({
      baseURL: process.env.REACT_APP_MOBILE_PATH,
    });
  }

  ping() {
    return this.serverAPI.get("/");
  }

  pingMobileAPK() {
    return this.mobileAPI.get("/client.apk");
  }

  about() {
    return this.serverAPI.get("/about.json");
  }

  getServices() {
    return this.serverAPI.get("/services");
  }

  createUser(user) {
    return this.serverAPI.post("/register", user);
  }

  getUserData(uid) {
    return this.serverAPI.get("/users/" + uid);
  }

  serviceAuth(service, uid) {
    return this.serverAPI.get(`/services/${service}?user_id=${uid}`);
  }

  logoutFromService(service, uid) {
    return this.serverAPI.post(`/services/logout/${service}?user_id=${uid}`);
  }

  createActionReaction(action, reaction, uid) {
    return this.serverAPI.post(
      `/createActionReaction/${action}/${reaction}?user_id=${uid}`
    );
  }

  updateActionReaction(id, key, value, uid) {
    return this.serverAPI.post(
      `/updateActionReaction/${id}/${key}/${value}?user_id=${uid}`
    );
  }

  deleteActionReaction(arId, uid) {
    return this.serverAPI.post(`/deleteActionReaction/${arId}?user_id=${uid}`);
  }
}

const APIClient = new Client();
export default APIClient;
