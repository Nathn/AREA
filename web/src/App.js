import expressServer from './api/express-server';
import React, { useState, useEffect } from 'react';

function App() {
  const [ping, setPing] = useState(null);

  useEffect(() => {
    expressServer.ping().then((response) => {
      setPing(response.data);
    });
  }, []);

  return (
    <div>
      {ping ? (
        <div>
          <p>Server ping:</p>
          <p>{ping}</p>
        </div>
      ) : (
        <p>Loading.. please wait!</p>
      )}
    </div>
  );
}

export default App;
