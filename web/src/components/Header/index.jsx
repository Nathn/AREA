import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import "./index.css";

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

function Header({ user }) {
  return (
    <nav>
      <Link to="/">
        <h3>Home</h3>
      </Link>
      {!user && (
        <Link to="/login">
          <h3>Sign in</h3>
        </Link>
      )}
      {user && (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      )}
      {user && (
        <a href="#" onClick={() => firebase.auth().signOut()}>
          <h3>Sign out</h3>
        </a>
      )}
    </nav>
  );
}

export default Header;
