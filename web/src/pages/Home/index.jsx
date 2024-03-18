import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDot as fasCircleDot,
  faArrowRight as fasArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import APIClient from "../../api/APIClient";
import "./index.css";

function App({ user, services }) {
  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    APIClient.about().then((response) => {
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
    APIClient.getUserData(user?.uid || userData.uid).then((response) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateActionReaction = (id, key, value, uid) => (event) => {
    APIClient.updateActionReaction(id, key, value, uid).then((response) => {
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

  const deleteActionReaction = (id, uid) => (event) => {
    APIClient.deleteActionReaction(id, uid).then((response) => {
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
      <h1 className="title">AREA ({process.env.NODE_ENV} mode)</h1>
      <h2 className="subtitle promo">
        <span className="highlight">{services.length}</span> services available
      </h2>
      <h2 className="subtitle promo">
        <span className="highlight">
          {services.map((s) => s.actions.length).reduce((a, b) => a + b, 0)}
        </span>{" "}
        actions
      </h2>
      <h2 className="subtitle promo">
        <span className="highlight">
          {services.map((s) => s.reactions.length).reduce((a, b) => a + b, 0)}
        </span>{" "}
        reactions
      </h2>
      {user ? (
        <div className="main">
          <h2 className="subtitle">My automations</h2>
          <div className="actions">
            {userData?.action_reactions?.map((ar, index) => (
              <div
                // className="action"
                className={`action ${ar.enabled ? "enabled" : "disabled"}`}
                key={index}
              >
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
                <span className="arrow">
                  <FontAwesomeIcon icon={fasArrowRight} />
                </span>
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
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  onClick={deleteActionReaction(ar._id, userData._id)}
                  href="#"
                >
                  Delete
                </a>
                <FontAwesomeIcon
                  onClick={updateActionReaction(
                    ar._id,
                    "enabled",
                    !ar.enabled,
                    userData._id
                  )}
                  // className={ar.enabled ? "enabled" : "disabled"}
                  className={`font-awesome-icon ${
                    ar.enabled ? "enabled" : "disabled"
                  }`}
                  title={ar.enabled ? "Enabled" : "Disabled"}
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
              <h2>
                Client host: <code>{about.client.host}</code>
              </h2>
              <h2>
                Server current time: <code>{about.server.current_time}</code>
              </h2>
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
