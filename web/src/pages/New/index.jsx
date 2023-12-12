import React, { useState, useEffect } from "react";
import { redirect } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";
import "./index.css";

function App(user) {
  return (
    <div className="App">
      <h1>Ajouter une action/réaction</h1>
    </div>
  );
}

export default App;
