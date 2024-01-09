import React from "react";

function App({user}) {
  return (
    <div>
      <h1>Profil</h1>
      <h2>Signed in as <strong>{user.displayName}</strong></h2>
    </div>
  );
}

export default App;
