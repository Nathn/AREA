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

  googleAuth(service) {
    return this.api.get("/auth/google/" + service);
  }

  googleAuthToken(service, code) {
    return this.api.post("/auth/google/" + service + "/token", { code });
  }
}

const expressServer = new ExpressServer();
export default expressServer;
