import React from "react";

function App({ user }) {
  return (
    <div className="App">
      {(!user && (
        <h1 className="title">You need to be logged in to access this page.</h1>
      )) || (
        <>
          {user?.photoURL && (
            <img
              src={user?.photoURL}
              style={{ borderRadius: "50%" }}
              className="title"
              alt="profile"
              width="100"
              height="100"
            />
          )}
          <h1>
            Signed in as <strong>{user?.displayName}</strong>
          </h1>
        </>
      )}
    </div>
  );
}

export default App;
