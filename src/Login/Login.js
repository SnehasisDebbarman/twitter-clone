import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";

import { provider, auth as fbAuth } from "../fb.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  //
  const [user, setUser] = useState(null);
  //use state hook for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  // Sign in with email and password

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
    <div>
      <center>
        <h1>Login</h1>
        {/* create a form to accept email and password */}
        <form>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={signInWithEmail}>Login</button>
        </form>
        <button onClick={signin}>Login with Google</button>
      </center>
    </div>
  );
};

export default Login;
