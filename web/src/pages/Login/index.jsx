import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import expressServer from "../../api/express-server";

const firebaseConfig = {
  apiKey: "AIzaSyAS_48Zw3y2m5BhZ1vqSQACsIjd36xaR2o",
  authDomain: "area-om.firebaseapp.com",
  projectId: "area-om",
  storageBucket: "area-om.appspot.com",
  messagingSenderId: "1082443809392",
  appId: "1:1082443809392:web:08cea15ff2455c9e8deab5",
  measurementId: "G-YLDGSLQMGY",
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
            return true;
          });
      } else {
        return true;
      }
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
    <div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default Login;
