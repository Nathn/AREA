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
    return this.api.get("/user/" + uid);
  }

  googleAuth(service) {
    return this.api.get("/auth/google/" + service);
  }
}

const expressServer = new ExpressServer();
export default expressServer;
