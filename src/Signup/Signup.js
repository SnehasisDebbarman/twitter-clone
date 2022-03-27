import React, { useState } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  //
  const [user, setUser] = useState(null);
  //usestate for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();
  let navigate = useNavigate();
  //check user is null or not and redirect to main page
  if (user) {
    navigate("../main", { replace: true });
  }

  // Sign in with email
  const signInWithEmail = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  // Sign in with email and password
  const signInWithEmailAndPassword = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //show error message
        alert(errorMessage);
        // ..
      });
  };

  return (
    <div>
      {/* create a form to accept email and password */}
      <form>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={signInWithEmail}>Signup</button>
      </form>
    </div>
  );
}
