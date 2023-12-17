import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);

  function getAuthentificationStates(userData) {
    if (userData?.auth?.google?.drive?.access_token)
      setIsGoogleDriveConnected(true);
    if (userData?.auth?.google?.gmail?.access_token) setIsGmailConnected(true);
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

  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
      {isGoogleDriveConnected && (
        <div>
          <h2>Google Drive est connecté</h2>
        </div>
      )}
      {!isGoogleDriveConnected && (
        <button
          className="google-button"
          onClick={() => {
            googleAuth("drive");
          }}
        >
          Se connecter avec Google Drive
        </button>
      )}
      {isGmailConnected && (
        <div>
          <h2>Gmail est connecté</h2>
        </div>
      )}
      {!isGmailConnected && (
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
  );
}

export default App;
