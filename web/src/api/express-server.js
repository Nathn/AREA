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

  createUser(user) {
    return this.api.post("/register", user);
  }

  getUserData(uid) {
    return this.api.get("/users/" + uid);
  }

  googleAuth() {
    return this.api.get("/auth/google");
  }

  createAction(action, reaction, tokens) {
    return this.api.post("/auth/google/" + action + "/" + reaction, tokens, {
      withCredentials: true,
    });
  }
}

const expressServer = new ExpressServer();
export default expressServer;
