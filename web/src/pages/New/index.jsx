import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faYammer,
  faMicrosoft,
  faDiscord,
  faFacebook,
  faReddit,
  faStackOverflow,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";

import expressServer from "../../api/express-server";
import "./index.css";

function App({ user, services }) {
  const [action, setAction] = useState("");
  const [reaction, setReaction] = useState("");

  const [googleAccess, setGoogleAccess] = useState(false);
  const [yammerAccess, setYammerAccess] = useState(false);
  const [githubAccess, setGithubAccess] = useState(false);
  const [outlookAccess, setOutlookAccess] = useState(false);
  const [discordAccess, setDiscordAccess] = useState(false);
  const [facebookAccess, setFacebookAccess] = useState(false);
  const [redditAccess, setRedditAccess] = useState(false);
  const [stackOverflowAccess, setStackOverflowAccess] = useState(false);
  const [twitchAccess, setTwitchAccess] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getAuthentificationStates(userData) {
    setGoogleAccess(userData?.auth?.google);
    setYammerAccess(userData?.auth?.yammer);
    setGithubAccess(userData?.auth?.github);
    setOutlookAccess(userData?.auth?.outlook);
    setDiscordAccess(userData?.auth?.discord);
    setFacebookAccess(userData?.auth?.facebook);
    setRedditAccess(userData?.auth?.reddit);
    setStackOverflowAccess(userData?.auth?.stackoverflow);
    setTwitchAccess(userData?.auth?.twitch);
  }

  useEffect(() => {
    let userData = null;
    if (!user || !user.user) {
      const cookie = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("userData="));
      if (!cookie) {
        window.location.assign("/login");
        return false;
      }
      userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      if (!userData) {
        window.location.assign("/login");
        return false;
      }
      getAuthentificationStates(userData);
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
        getAuthentificationStates(response.data);
        return true;
      });
  }, [user]);

  async function auth(service) {
    await expressServer.serviceAuth(service).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        return;
      }
      window.location.assign(response.data);
    });
  }

  async function logout(service) {
    await expressServer.logoutFromService(service).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        return;
      }
      getAuthentificationStates(response.data);
    });
  }

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
        {/* Google */}
        <button
          className={googleAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!googleAccess) {
              auth("google");
            } else {
              logout("google");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faGoogle} />
            <span>Google services</span>
          </div>
          {googleAccess ? "Connected" : "Connect"}
        </button>

        {/* Yammer */}
        <button
          className={yammerAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!yammerAccess) {
              auth("yammer");
            } else {
              logout("yammer");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faYammer} />
            <span>Yammer</span>
          </div>
          {yammerAccess ? "Connected" : "Connect"}
        </button>

        {/* GitHub */}
        <button
          className={githubAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!githubAccess) {
              auth("github");
            } else {
              logout("github");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faGithub} />
            <span>GitHub</span>
          </div>
          {githubAccess ? "Connected" : "Connect"}
        </button>

        {/* Outlook */}
        <button
          className={outlookAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!outlookAccess) {
              auth("outlook");
            } else {
              logout("outlook");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faMicrosoft} />
            <span>Outlook</span>
          </div>
          {outlookAccess ? "Connected" : "Connect"}
        </button>

        {/* Discord */}
        <button
          className={discordAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!discordAccess) {
              auth("discord");
            } else {
              logout("discord");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faDiscord} />
            <span>Discord</span>
          </div>
          {discordAccess ? "Connected" : "Connect"}
        </button>

        {/* Facebook */}
        <button
          className={facebookAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!facebookAccess) {
              auth("facebook");
            } else {
              logout("facebook");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faFacebook} />
            <span>Facebook</span>
          </div>
          {facebookAccess ? "Connected" : "Connect"}
        </button>

        {/* Reddit */}
        <button
          className={redditAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!redditAccess) {
              auth("reddit");
            } else {
              logout("reddit");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faReddit} />
            <span>Reddit</span>
          </div>
          {redditAccess ? "Connected" : "Connect"}
        </button>

        {/* StackOverflow */}
        <button
          className={
            stackOverflowAccess ? "login-button logged" : "login-button"
          }
          onClick={() => {
            if (!stackOverflowAccess) {
              auth("stackoverflow");
            } else {
              logout("stackoverflow");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faStackOverflow} />
            <span>StackOverflow</span>
          </div>
          {stackOverflowAccess ? "Connected" : "Connect"}
        </button>

        {/* Reddit */}
        <button
          className={twitchAccess ? "login-button logged" : "login-button"}
          onClick={() => {
            if (!twitchAccess) {
              auth("twitch");
            } else {
              logout("twitch");
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faTwitch} />
            <span>Twitch</span>
          </div>
          {twitchAccess ? "Connected" : "Connect"}
        </button>
      </div>
      <form onSubmit={createActionReaction} className="form-action">
        <label htmlFor="action">Action</label>
        <select
          name="action"
          id="action"
          defaultValue=""
          required
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="" disabled>
            Select an action
          </option>
          {services.map(
            (service) =>
              (service.type !== "google" || googleAccess) &&
              (service.type !== "yammer" || yammerAccess) &&
              (service.type !== "github" || githubAccess) &&
              (service.type !== "outlook" || outlookAccess) &&
              (service.type !== "discord" || discordAccess) &&
              (service.type !== "facebook" || facebookAccess) &&
              service.actions.map((action) => (
                <option
                  value={`${service.name_short}_${action.name_short}`}
                  key={`${service.name_short}_${action.name_short}`}
                >
                  {`${service.name_long} - ${action.name_long}`}
                </option>
              ))
          )}
        </select>
        <label htmlFor="reaction">Reaction</label>
        <select
          name="reaction"
          id="reaction"
          defaultValue=""
          required
          onChange={(e) => setReaction(e.target.value)}
        >
          <option value="" disabled>
            Select a reaction
          </option>
          {services.map(
            (service) =>
              (service.type !== "google" || googleAccess) &&
              (service.type !== "yammer" || yammerAccess) &&
              (service.type !== "github" || githubAccess) &&
              (service.type !== "outlook" || outlookAccess) &&
              (service.type !== "discord" || discordAccess) &&
              (service.type !== "facebook" || facebookAccess) &&
              service.reactions.map((reaction) => (
                <option
                  value={`${service.name_short}_${reaction.name_short}`}
                  key={`${service.name_short}_${reaction.name_short}`}
                >{`${service.name_long} - ${reaction.name_long}`}</option>
              ))
          )}
        </select>
        <button>Create</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;
