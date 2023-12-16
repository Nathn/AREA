import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  useEffect(() => {
    // check for code in url
    const url = window.location.href;
    const code = url.match(/code=([^&]*)/);
    if (code) {
      // if code found, send it to the server
      expressServer
        .googleAuthToken("drive", code[1])
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

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
    </div>
  );
}

export default App;
