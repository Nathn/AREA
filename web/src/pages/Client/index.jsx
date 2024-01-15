import React, { useEffect } from "react";

function App({ user, services }) {
  useEffect(() => {
    window.location.assign("http://172.18.0.4:8090/client.apk")
  }, [window]);
}

export default App;
