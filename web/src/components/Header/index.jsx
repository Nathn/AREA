import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { FaBars, FaTimes } from 'react-icons/fa';

import Button from 'react-bootstrap/Button'

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
  }

  return (
    <header id="navHeader">
      <h3>AREA</h3>

      <nav id="navBar" ref={navRef}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/new">New</Link>
            <Link to="/profil">Profil</Link>
            <Button variant="danger" onClick={() => firebase.auth().signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <Button variant="success" onClick={() => window.location.assign("/login")}>
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
