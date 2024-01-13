import React, { useState, useEffect } from "react";

import expressServer from "../../api/express-server";

function App({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    const cookie = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("userData="));
    if (cookie) {
      setUserData(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
    }
    // get user data from db
    expressServer.getUserData(user?.uid || userData.uid).then((response) => {
      if (response.status !== 200) {
        console.warn(response);
        return;
      }
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(response.data) || ""
      )}; expires=${expiryDate}; path=/; SameSite=Lax`;
      setUserData(response.data);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
          {userData && (
            <div>
              <h3 className="subtitle">
                Joined on{" "}
                <strong>
                  {new Date(userData.created_at).toLocaleDateString()}
                </strong>
              </h3>
              <h2 className="subtitle promo">
                <span className="highlight">
                  {
                    Object.values(userData.auth).filter(
                      (value) => value === true
                    ).length
                  }
                </span>{" "}
                services connected
              </h2>
              <h2 className="subtitle promo">
                <span className="highlight">
                  {userData.action_reactions.length}
                </span>{" "}
                automations created
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
