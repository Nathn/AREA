import { useRef } from "react";
import { NavLink } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { FaBars, FaTimes } from "react-icons/fa";

import Button from "react-bootstrap/Button";

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
  const navRef = useRef(null);

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive-nav");
  };

  return (
    <header id="navHeader">
      <a
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
          color: "white",
          textDecoration: "none",
        }}
        href="/"
      >
        <img src="/logo512.png" alt="logo" width="50" height="50" />
        <h2 style={{ fontStyle: "italic", fontWeight: "bold" }}>AREA</h2>
      </a>

      <nav id="navBar" ref={navRef}>
        <NavLink to="/">Home</NavLink>
        {user ? (
          <>
            <NavLink to="/new">New</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            {/* /client.apk */}
            <a href="/client.apk" _target="blank">Download APK</a>
            <Button variant="danger" onClick={() => firebase.auth().signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="success"
            onClick={() => window.location.assign("/login")}
          >
            Login
          </Button>
        )}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button id="navBurger" className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Header;
