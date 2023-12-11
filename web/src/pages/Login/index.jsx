import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_AP_FIREBASEP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      if (authResult.additionalUserInfo.isNewUser) {
        expressServer
          .createUser({
            uid: authResult.user.uid,
            email: authResult.user.email,
            name: authResult.user.displayName,
            photoURL: authResult.user.photoURL,
          })
          .then((response) => {
            if (response.status !== 200) {
              console.log(response);
              return false;
            }
            window.location.assign("/");
            return false;
          });
      }
      window.location.assign("/");
      return true;
    },
  },
  signInSuccessUrl: "/",
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  tosUrl: "/tos",
  privacyPolicyUrl: "/privacy",
};

function Login() {
  return (
    <div className="App">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default Login;
