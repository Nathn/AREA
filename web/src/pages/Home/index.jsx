import React, { useState, useEffect } from "react";

import expressServer from "../../api/express-server";

function App() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>AREA</h1>
      <div>
        {about ? (
          <div>
            <h2>Client host: {about.client.host}</h2>
            <h2>Server current time: {about.server.current_time}</h2>
          </div>
        ) : (
          <div>
            <h2>Loading...</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
