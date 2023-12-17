import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import expressServer from "../../api/express-server";
import "./index.css";

function App({ user }) {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>AREA ({process.env.NODE_ENV} mode)</h1>
      <Link className="main-button" to={user ? "/new" : "/login"}>
        Créer une nouvelle action/réaction
      </Link>
      {user ? (
        <div className="main">
          <h2>Mes actions/réactions</h2>
        </div>
      ) : (
        <div>
          {about ? (
            <div className="main">
              <h2>Client host: {about.client.host}</h2>
              <h2>Server current time: {about.server.current_time}</h2>
            </div>
          ) : (
            <div className="main">
              <h2>Loading...</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
