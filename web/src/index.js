import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import "./index.css";
import reportWebVitals from "./reportWebVitals";

import Home from "./pages/Home/";
import Login from "./pages/Login/";
import New from "./pages/New/";

import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null);

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
    const cookieValue = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("user="))
      ?.split("=")[1];

    const userFromCookie = cookieValue
      ? JSON.parse(decodeURIComponent(cookieValue))
      : null;
    if (userFromCookie) {
      setUser(userFromCookie);
    }

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user || null);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `user=${encodeURIComponent(
        (user ? JSON.stringify(user) : null) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
    });
    return () => unsubscribe();
  }, []);

  if (user) {
    return (
      <Router>
        <Header user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/new" element={<New user={user} />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <Header user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/new" element={<New user={user} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    );
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
