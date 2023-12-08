import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import "./index.css";

const firebaseConfig = {
  apiKey: "AIzaSyAS_48Zw3y2m5BhZ1vqSQACsIjd36xaR2o",
  authDomain: "area-om.firebaseapp.com",
  projectId: "area-om",
  storageBucket: "area-om.appspot.com",
  messagingSenderId: "1082443809392",
  appId: "1:1082443809392:web:08cea15ff2455c9e8deab5",
  measurementId: "G-YLDGSLQMGY",
};

firebase.initializeApp(firebaseConfig);

function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieValue = document.cookie
      ?.split('; ')
      ?.find(row => row.startsWith('user='))
      ?.split('=')[1];

    const user = cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : null;
    if (user) {
      setUser(user);
      setLoading(false);
    }

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; expires=${expiryDate}; path=/`;
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
        <a href="" onClick={() => firebase.auth().signOut()}>
        <h3>Sign out</h3>
      </a>
      )}
    </nav>
  );
}

export default Header;
