import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import "./index.css";
import reportWebVitals from "./reportWebVitals";
import expressServer from "./api/express-server";

import Home from "./pages/Home/";
import Login from "./pages/Login/";
import New from "./pages/New/";
import Profil from "./pages/Profil/";
import Mobile from "./pages/Mobile";

import Header from "./components/Header";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);

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
    const userCookieValue = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("user="))
      ?.split("=")[1];
    const userFromCookie = userCookieValue
      ? JSON.parse(decodeURIComponent(userCookieValue))
      : null;
    if (userFromCookie) {
      setUser(userFromCookie);
    }

    const servicesCookieValue = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("services="))
      ?.split("=")[1];
    const servicesFromCookie = servicesCookieValue
      ? JSON.parse(decodeURIComponent(servicesCookieValue))
      : null;
    if (servicesFromCookie) {
      setServices(servicesFromCookie);
    }

    expressServer.getServices().then((response) => {
      setServices(response.data);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `services=${encodeURIComponent(
        JSON.stringify(response.data)
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
    });

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

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<Home user={user} services={services} />} />
        <Route path="/new" element={<New user={user} services={services} />} />
        <Route path="/profile" element={<Profil user={user} />} />
        {!user && <Route path="/login" element={<Login />} />}
        <Route path="/client.apk" element={<Mobile />} />
      </Routes>
    </Router>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
