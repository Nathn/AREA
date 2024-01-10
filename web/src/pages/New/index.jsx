import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeezer, faDiscord, faFacebook, faGithub, faGoogle, faMicrosoft, faReddit, faTwitch, faYammer } from "@fortawesome/free-brands-svg-icons";

import expressServer from "../../api/express-server";
import "./index.css";

async function auth(service, uid) {
  await expressServer.serviceAuth(service, uid).then((response) => {
    if (response.status !== 200) {
      console.warn(response);
      return;
    }
    window.location.assign(response.data);
  });
}

async function logout(service, servicesData, setServicesData) {
  await expressServer.logoutFromService(service).then((response) => {
    if (response.status !== 200) {
      console.warn(response);
      return;
    }
    getAuthentificationStates(response.data, servicesData, setServicesData);
  });
}

const manageButtonState = (service, uid, servicesData, setServicesData) => {
  if (!servicesData[service].access) {
    auth(servicesData[service].service_name, uid);
  } else {
    logout(servicesData[service].service_name, servicesData, setServicesData);
  }
}

const getUserData = () => {
  const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("userData="));
  if (!cookie) {
    window.location.assign("/login");
    return false;
  }

  const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  if (!userData) {
    window.location.assign("/login");
    return false;
  }

  return userData;
};

const getAuthentificationStates = (userData, servicesData, setServicesData) => {
  const servicesDataCopy = { ...servicesData };
  Object.keys(servicesDataCopy).forEach((service) => {
    servicesDataCopy[service].access = userData?.auth?.[service];
  });
  setServicesData(servicesDataCopy);
}

function App({ user, services }) {
  const [action, setAction] = useState("");
  const [reaction, setReaction] = useState("");

  const [uid, setUid] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [servicesData, setServicesData] = useState({
    deezer: { icon: faDeezer, display_name: "Deezer", service_name: "deezer", access: null },
    discord: { icon: faDiscord, display_name: "Discord", service_name: "discord", access: null },
    facebook: { icon: faFacebook, display_name: "Facebook", service_name: "facebook", access: null },
    github: { icon: faGithub, display_name: "GitHub", service_name: "github", access: null },
    google: { icon: faGoogle, display_name: "Google", service_name: "google", access: null },
    outlook: { icon: faMicrosoft, display_name: "Outlook", service_name: "outlook", access: null },
    reddit: { icon: faReddit, display_name: "Reddit", service_name: "reddit", access: null },
    twitch: { icon: faTwitch, display_name: "Twitch", service_name: "twitch", access: null },
    yammer: { icon: faYammer, display_name: "Yammer", service_name: "yammer", access: null },
  });

  const allServicesNames = Object.keys(servicesData).map((service) => servicesData[service].service_name);

  useEffect(() => {
    let userData = null;
    if (!user || !user.user) {
      userData = getUserData();
      if (!userData) {
        return false;
      }
      setUid(userData._id);
      getAuthentificationStates(userData, servicesData, setServicesData);
    }
    // get user data from db
    expressServer
      .getUserData(user?.user?.uid || userData.uid)
      .then((response) => {
        if (response.status !== 200) {
          console.warn(response);
          return false;
        }
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `userData=${encodeURIComponent(
          JSON.stringify(response.data) || ""
        )}; expires=${expiryDate}; path=/; SameSite=Lax`;
        setUid(response.data._id);
        getAuthentificationStates(response.data, servicesData, setServicesData);
        return true;
      });
  }, [user]);

  const createActionReaction = (event) => {
    event.preventDefault();
    expressServer.createActionReaction(action, reaction).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        setErrorMessage(response.data);
        return;
      }
      setSuccessMessage("Action/reaction successfully created.");
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(response.data) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
      return;
    });
  };

  return (
    <div className="App">
      <h1>Add an action/reaction</h1>
      <div className="buttons">
        {Object.keys(servicesData).map((service, index) => (
          <button className={servicesData[service].access ? "login-button logged" : "login-button"} onClick={() => manageButtonState(service, uid, servicesData, setServicesData)} key={index}>
            <div className="service-name">
              <FontAwesomeIcon icon={servicesData[service].icon} />
              <span>{servicesData[service].display_name}</span>
            </div>
            {servicesData[service].access ? "Connected" : "Connect"}
          </button>
        ))}
      </div>

      <form onSubmit={createActionReaction} className="form-action">
        <label htmlFor="action">Action</label>
        <select name="action" id="action" defaultValue="" required onChange={(e) => setAction(e.target.value)}>
          <option value="" disabled>
            Select an action
          </option>
          {
            services.sort((a, b) => a.name_long.localeCompare(b.name_long)).map((service) =>
              allServicesNames.includes(service.type) && servicesData[service.type].access &&
              service.actions.map((action) => (
                <option value={`${service.name_short}_${action.name_short}`} key={`${service.name_short}_${action.name_short}`}>
                  {`${service.name_long} - ${action.name_long}`}
                </option>
              ))
            )
          }
        </select>
        <label htmlFor="reaction">Reaction</label>
        <select name="reaction" id="reaction" defaultValue="" required onChange={(e) => setReaction(e.target.value)}>
          <option value="" disabled>
            Select a reaction
          </option>
          {
            services.sort((a, b) => a.name_long.localeCompare(b.name_long)).map((service) =>
              allServicesNames.includes(service.type) && servicesData[service.type].access &&
              service.reactions.map((reaction) => (
                <option value={`${service.name_short}_${reaction.name_short}`} key={`${service.name_short}_${reaction.name_short}`}>
                  {`${service.name_long} - ${reaction.name_long}`}
                </option>
              ))
            )
          }
        </select>
        <button>Create</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;
