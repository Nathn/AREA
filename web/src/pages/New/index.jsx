import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  const [action, setAction] = useState("");
  const [reaction, setReaction] = useState("");

  const [googleAccessTokens, setGoogleAccessTokens] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function getAuthentificationStates(userData) {
    if (userData?.auth?.google?.access_token)
      setGoogleAccessTokens(userData?.auth?.google);
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

  async function googleAuth() {
    await expressServer.googleAuth().then((response) => {
      window.location.assign(response.data);
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
        <button
          className={
            googleAccessTokens ? "login-button logged" : "login-button"
          }
          onClick={() => {
            if (!googleAccessTokens) {
              googleAuth();
            }
          }}
        >
          <div className="service-name">
            <FontAwesomeIcon icon={faGoogle} />
            <span>Google services</span>
          </div>
          {googleAccessTokens ? "Connected" : "Connect"}
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
          {googleAccessTokens && (
            <option value="drive_fileUpload">Google Drive - File Upload</option>
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
          {googleAccessTokens && (
            <option value="gmail_sendEmail">Gmail - Send Email</option>
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
