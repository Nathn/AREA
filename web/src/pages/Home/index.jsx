import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import expressServer from "../../api/express-server";
import "./index.css";

function App({ user }) {
  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
  }, []);

  useEffect(() => {
    if (!user || !user.user) {
      const cookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("userData="));
      if (!cookie) {
        return;
      }
      setUserData(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
      if (!userData) {
        return;
      }
    }
    // get user data from db
    expressServer
      .getUserData(user?.user?.uid || userData.uid)
      .then((response) => {
        if (response.status !== 200) {
          console.warn(response);
          return;
        }
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `userData=${encodeURIComponent(
          JSON.stringify(response.data) || ""
        )}; expires=${expiryDate}; path=/; SameSite=Lax`;
        setUserData(response.data);
        return;
      });
  }, [user]);

  const deleteActionReaction = (id) => (event) => {
    expressServer.deleteActionReaction(id).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        return;
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(response.data) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
      setUserData(response.data);
      return;
    });
  };

  return (
    <div className="App">
      <h1>AREA ({process.env.NODE_ENV} mode)</h1>
      <Link className="main-button" to={user ? "/new" : "/login"}>
        Créer une nouvelle action/réaction
      </Link>
      {user ? (
        <div className="main">
          <h2>Mes actions/réactions actives</h2>
          <div className="actions">
            {userData?.action_reactions?.map((ar, index) => (
              <div className="action active" key={index}>
                <span>{ar.action}</span>
                <span className="arrow">→</span>
                <span>{ar.reaction}</span>
                <a onClick={deleteActionReaction(ar._id)} href="#">
                  Supprimer
                </a>
              </div>
            ))}
          </div>
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
