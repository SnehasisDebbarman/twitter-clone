import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";

import { provider } from "../fb.js";
import { getAuth, signInWithPopup } from "firebase/auth";

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

  let navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      navigate("main");
    }
  }, [user]);

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
      });
  };

  const signin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        //const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        setUser(user);
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //alert("error", errorMessage, errorCode);
        console.log(errorCode, errorMessage);
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
