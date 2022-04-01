import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";

import { provider, auth as fbAuth } from "../fb.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { signInWithEmailAndPassword } from "firebase/auth";

import profileIcon from "../assets/profile.png";
import "./login.css";
import "./loading.css";

const Login = () => {
  const [user, setUser] = useState(null);
  //use state hook for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //loading function
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    setUser(fbAuth.currentUser);
    if (user) {
      navigate("main");
    }
  }, [user, navigate]);

  if (user) {
    navigate("main");
  }
  // on Sign up click
  const signUpRedirect = () => {
    navigate("signup", { replace: true });
  };

  // Sign in with email
  const signInWithEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {}, 2000);
    // setPersistence(auth, inMemoryPersistence).then(() => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        setUser(user);
        // setUserData(user);

        setLoading(false);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("error", errorMessage, errorCode);
      });
    // });
  };

  const signin = () => {
    const auth = getAuth();
    // setPersistence(auth, inMemoryPersistence).then(() => {
    return signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        // The signed-in user info.

        const user = result.user;
        // setUserData(user);
        setUser(user);
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("error", errorMessage, errorCode);
      });
    // });
  };

  return (
    <div className="login-card">
      <form className="login-form" onSubmit={signInWithEmail}>
        <h3 className="login-heading">Login</h3>
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
        <div className="divider">or continue with</div>

        <button className="googleSigninBtn" onClick={signin}>
          Sign in with Google
        </button>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <strong onClick={signUpRedirect}>Sign up</strong>
        </p>
      </form>
      {/* create divider with "or continue text " in it */}
      {/* loading popup */}
      {loading && (
        <div className="loading-container">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
