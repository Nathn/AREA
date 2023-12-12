import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App({ user, setUser }) {
  const [about, setAbout] = useState(null);
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_AP_FIREBASEP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user || null);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `user=${encodeURIComponent(
        (user ? JSON.stringify(user) : null) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
    });
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1>AREA ({process.env.NODE_ENV} mode)</h1>
      <Link className="main-button" to={user ? "/new" : "/login"}>
        Créer une nouvelle action/réaction
      </Link>
      {user ? (
        <div className="main">
          <h2>Mes actions/réactions</h2>
        </div>
      ) : (
        <div>
          {about ? (
            <div className="main">
              <h2>Client host: {about.client.host}</h2>
              <h2>Server current time: {about.server.current_time}</h2>
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
