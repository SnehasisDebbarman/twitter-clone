import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  getAuth,
} from "firebase/auth";
import { auth, provider } from "../fb";

import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import "./loading.css";

const Login = () => {
  const [user, setUser] = useState(null);
  //use state hook for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //loading function
  const [loading, setLoading] = useState(false);
  // const auth = getAuth();
  // const provider = new GoogleAuthProvider();

  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("main");
    }
  }, []);

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
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setLoading(false);
        alert("error", errorMessage, errorCode);
      });
  };

  const signin = (e) => {
    e.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
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
        console.log("error", errorMessage, errorCode, email);
        // ...
      });
  };

  return (
    <div className="login-card">
      <form className="login-form">
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
        <button
          className="loginSubmitBtn"
          type="submit"
          onClick={signInWithEmail}
        >
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
