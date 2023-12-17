import React, { useState, useEffect } from "react";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  useEffect(() => {
    if (!user || !user.user) {
      window.location.assign("/login");
    } else {
      // get user data from db
      // expressServer.getUserData(user.user.uid).then((response) => {
      //   if (response.status !== 200) {
      //     console.log(response);
      //     return false;
      //   }
      //   console.log(response);
      //   return true;
      // });
    }
  }, [user]);

  async function googleAuth(service) {
    await expressServer.googleAuth(service).then((response) => {
      window.location.assign(response.data);
    });
  }

  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
      <button
        className="google-button"
        onClick={() => {
          googleAuth("drive");
        }}
      >
        Se connecter avec Google Drive
      </button>
      <button
        className="google-button"
        onClick={() => {
          googleAuth("gmail");
        }}
      >
        Se connecter avec Gmail
      </button>
    </div>
  );
}

export default App;
