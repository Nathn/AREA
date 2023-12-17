import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
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
