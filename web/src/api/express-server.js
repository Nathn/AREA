import axios from "axios";

class ExpressServer {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080/",
    });
  }

  ping() {
    return this.api.get("/");
  }

  about() {
    return this.api.get("/about.json");
  }

  getServices() {
    return this.api.get("/services");
  }

  createUser(user) {
    return this.api.post("/register", user);
  }

  getUserData(uid) {
    return this.api.get("/users/" + uid);
  }

  serviceAuth(service, uid) {
    return this.api.get(`/services/${service}?user_id=${uid}`);
  }

  logoutFromService(service, uid) {
    return this.api.post(`/services/logout/${service}?user_id=${uid}`);
  }

  createActionReaction(action, reaction, uid) {
    return this.api.post(
      `/createActionReaction/${action}/${reaction}?user_id=${uid}`
    );
  }

  updateActionReaction(id, key, value, uid) {
    return this.api.post(
      `/updateActionReaction/${id}/${key}/${value}?user_id=${uid}`
    );
  }

  deleteActionReaction(arId, uid) {
    return this.api.post(`/deleteActionReaction/${arId}?user_id=${uid}`);
  }
}

const expressServer = new ExpressServer();
export default expressServer;
