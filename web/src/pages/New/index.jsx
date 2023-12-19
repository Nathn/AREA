import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  const [action, setAction] = useState("");
  const [reaction, setReaction] = useState("");

  const [googleAccessTokens, setGoogleAccessTokens] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

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

  const createAction = (event) => {
    event.preventDefault();
    expressServer
      .createAction(action, reaction, googleAccessTokens)
      .then((res) => {
        if (res.status === 200) {
          setSuccessMessage("Action créée avec succès.");
        } else {
          console.error(res);
        }
      });
  };

  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
      <div className="buttons">
        {googleAccessTokens && (
          <div>
            <h2>Les services Google sont connectés</h2>
          </div>
        )}
        {!googleAccessTokens && (
          <button
            className="google-button"
            onClick={() => {
              googleAuth();
            }}
          >
            Se connecter avec Google
          </button>
        )}
      </div>
      <form onSubmit={createAction} className="form-action">
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
          {googleAccessTokens && <option value="drive">Google Drive</option>}
          {googleAccessTokens && <option value="gmail">Gmail</option>}
        </select>
        <label htmlFor="reaction">Réaction</label>
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
          {googleAccessTokens && <option value="drive">Google Drive</option>}
          {googleAccessTokens && <option value="gmail">Gmail</option>}
        </select>
        <button>Créer</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
}

export default App;
