import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyAS_48Zw3y2m5BhZ1vqSQACsIjd36xaR2o",
  authDomain: "area-om.firebaseapp.com",
  projectId: "area-om",
  storageBucket: "area-om.appspot.com",
  messagingSenderId: "1082443809392",
  appId: "1:1082443809392:web:08cea15ff2455c9e8deab5",
  measurementId: "G-YLDGSLQMGY",
};

function Login() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const ui =
    firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("loader").style.display = "none";
      },
    },
    signInSuccessUrl: "/",
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      // GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: "/",
    privacyPolicyUrl: "/",
  };

  ui.start("#firebaseui-auth-container", uiConfig);

  return (
    <div>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </div>
  );
}

export default Login;
