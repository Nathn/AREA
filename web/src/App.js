import expressServer from './api/express-server';
import React, { useState, useEffect } from 'react';

function App() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    expressServer.about().then((response) => {
      setAbout(response.data);
    });
  }, []);

  return (
    <div>
      { about ? (
        <div>
          <h1>Client host: {about.client.host}</h1>
          <h1>Server current time: {about.server.current_time}</h1>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
}

export default App;
