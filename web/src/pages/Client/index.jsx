import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";

function App({ user, services }) {
  useEffect(() => {
    window.onload = function () {
      window.location.assign("http://127.0.0.1:8090/client.apk");
    };
  }, []);

  return (
    <div className="App">
      <h2 className="title">Your download should start soon...</h2>
      <Button variant="primary" onClick={() => window.location.assign("/")}>
        Return to the home screen
      </Button>
    </div>
  );
}

export default App;
