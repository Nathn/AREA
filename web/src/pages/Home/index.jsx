import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot as fasCircleDot } from "@fortawesome/free-solid-svg-icons";

import expressServer from "../../api/express-server";
import "./index.css";

function App({ user, services }) {
  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const cookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("userData="));
    if (cookie) {
      setUserData(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
    }
    // get user data from db
    expressServer.getUserData(user?.uid || userData.uid).then((response) => {
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

  const updateActionReaction = (id, key, value) => (event) => {
    expressServer.updateActionReaction(id, key, value).then((response) => {
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
        Create a new action/reaction
      </Link>
      {user ? (
        <div className="main">
          <h2>My active action/reactions</h2>
          <div className="actions">
            {userData?.action_reactions?.map((ar, index) => (
              <div className="action active" key={index}>
                {services.map((service) =>
                  service.actions.map((action) =>
                    service.name_short + "_" + action.name_short ===
                    ar.action ? (
                      <span key={index}>
                        {service.name_long} - {action.name_long}
                      </span>
                    ) : null
                  )
                )}
                <span className="arrow">→</span>
                {services.map((service) =>
                  service.reactions.map((reaction) =>
                    service.name_short + "_" + reaction.name_short ===
                    ar.reaction ? (
                      <span key={index}>
                        {service.name_long} - {reaction.name_long}
                      </span>
                    ) : null
                  )
                )}
                <a onClick={deleteActionReaction(ar._id)} href="#">
                  Delete
                </a>
                <FontAwesomeIcon
                  onClick={updateActionReaction(ar._id, "enabled", !ar.enabled)}
                  className={ar.enabled ? "enabled" : "disabled"}
                  icon={fasCircleDot}
                />
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
