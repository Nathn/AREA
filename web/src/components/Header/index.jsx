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

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieValue = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("user="))
      ?.split("=")[1];

    const user = cookieValue
      ? JSON.parse(decodeURIComponent(cookieValue))
      : null;
    if (user) {
      setUser(user);
      setLoading(false);
    }

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user || null);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `user=${encodeURIComponent(
        (user ? JSON.stringify(user) : null) || ""
      )}; expires=${expiryDate}; path=/`;
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <nav>
      <Link to="/">
        <h3>Home</h3>
      </Link>
      {!user && !loading && (
        <Link to="/login">
          <h3>Sign in</h3>
        </Link>
      )}
      {user && !loading && (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      )}
      {user && !loading && (
        <a href="#" onClick={() => firebase.auth().signOut()}>
          <h3>Sign out</h3>
        </a>
      )}
    </nav>
  );
}

export default Header;
