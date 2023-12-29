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

  googleAuth() {
    return this.api.get("/services/google");
  }

  MicrosoftAuth() {
    return this.api.get("/services/yammer");
  }

  githubAuth() {
    return this.api.get("/services/github");
  }

  createActionReaction(action, reaction) {
    return this.api.post(
      "/createActionReaction/" + action + "/" + reaction,
      {},
      {
        withCredentials: true,
      }
    );
  }

  deleteActionReaction(arId) {
    return this.api.post(
      "/deleteActionReaction/" + arId,
      {},
      {
        withCredentials: true,
      }
    );
  }
}

const expressServer = new ExpressServer();
export default expressServer;
