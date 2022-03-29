import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";

import { provider, auth as fbAuth } from "../fb.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import "./login.css";
import "./loading.css";

const Login = () => {
  //
  const [user, setUser] = useState(null);
  //use state hook for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //loading function
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    setUser(fbAuth.currentUser);
  }, []);

  //check user is null or not and redirect to main page
  if (user) {
    navigate("main", { replace: true });
  }

  // Sign in with email
  const signInWithEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {}, 2000);
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        setLoading(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        setLoading(false);
      });
  };

  // on Sign up click
  const signUpRedirect = () => {
    navigate("signup", { replace: true });
  };

  const signin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.

        const user = result.user;
        setUser(user);
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.

        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert(errorMessage, email, credential);

        // ...
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-form">
          <h1 className="login-heading">Login</h1>
          <form className="loginForm" onSubmit={signInWithEmail}>
            <input
              className="loginInput"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="loginInput"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="loginSubmitBtn" type="submit">
              Login
            </button>
          </form>
          {/* create divider with "or continue text " in it */}
          <div className="divider">or continue with</div>

          <button className="loginSubmitBtn" onClick={signin}>
            Sign in with Google
          </button>

          <p>
            Don't have an account?{" "}
            <strong onClick={signUpRedirect}>Sign up</strong>
          </p>
        </div>
        {/* loading popup */}
        {loading && (
          <div className="loading-container">
            <div class="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
