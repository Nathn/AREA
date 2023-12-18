import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  const [action, setAction] = useState("drive");
  const [reaction, setReaction] = useState("gmail");

  const [googleDriveAccessTokens, setGoogleDriveAccessTokens] = useState("");
  const [gmailAccessTokens, setGmailAccessTokens] = useState("");

  function getAuthentificationStates(userData) {
    if (userData?.auth?.google?.drive?.access_token)
      setGoogleDriveAccessTokens(userData?.auth?.google?.drive);
    if (userData?.auth?.google?.gmail?.access_token)
      setGmailAccessTokens(userData?.auth?.google?.gmail);
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

  async function googleAuth(service) {
    await expressServer.googleAuth(service).then((response) => {
      window.location.assign(response.data);
    });
  }

  const createAction = (event) => {
    event.preventDefault();
    expressServer
      .createAction(action, reaction, googleDriveAccessTokens)
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
      <div className="buttons">
        {googleDriveAccessTokens && (
          <div>
            <h2>Google Drive est connecté</h2>
          </div>
        )}
        {!googleDriveAccessTokens && (
          <button
            className="google-button"
            onClick={() => {
              googleAuth("drive");
            }}
          >
            Se connecter avec Google Drive
          </button>
        )}
        {gmailAccessTokens && (
          <div>
            <h2>Gmail est connecté</h2>
          </div>
        )}
        {!gmailAccessTokens && (
          <button
            className="google-button"
            onClick={() => {
              googleAuth("gmail");
            }}
          >
            Se connecter avec Gmail
          </button>
        )}
      </div>
      <form onSubmit={createAction} className="form-action">
        <label htmlFor="action">Action</label>
        <select
          name="action"
          id="action"
          defaultValue="drive"
          required
          onChange={(e) => setAction(e.target.value)}
        >
          {googleDriveAccessTokens && (
            <option value="drive">Google Drive</option>
          )}
          {gmailAccessTokens && <option value="gmail">Gmail</option>}
        </select>
        <label htmlFor="reaction">Réaction</label>
        <select
          name="reaction"
          id="reaction"
          defaultValue="gmail"
          required
          onChange={(e) => setReaction(e.target.value)}
        >
          {googleDriveAccessTokens && (
            <option value="drive">Google Drive</option>
          )}
          {gmailAccessTokens && <option value="gmail">Gmail</option>}
        </select>
        <button>Créer</button>
      </form>
    </div>
  );
}

export default App;
