import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../fb";

import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import "./loading.css";

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const debugRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log(result);
        setUser(result.user);
        setLoading(false);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  let navigate = useNavigate();
  useEffect(() => {
    debugRedirectResult();
  });

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
        setLoading(false);
        alert("error", errorMessage, errorCode);
      });
  };
  // On Button Click
  const signUpGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log(error);
    }
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

        <button className="googleSigninBtn" onClick={signUpGoogle}>
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
