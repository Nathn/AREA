import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const cookieValue = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("user="))
      ?.split("=")[1];
    const user = cookieValue
      ? JSON.parse(decodeURIComponent(cookieValue))
      : null;
    if (user) {
      setUser(user);
    }

    expressServer.about().then((response) => {
      setAbout(response.data);
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user || null);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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
