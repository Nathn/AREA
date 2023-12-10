import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

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
    }

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user || null);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
    </div>
  );
}

export default App;
