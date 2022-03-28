import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

export default function Signup() {
  //
  const [user, setUser] = useState(null);
  //usestate for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //updated name
  const [updatedName, setUpdatedName] = useState("");

  const auth = getAuth();
  let navigate = useNavigate();

  function updateName(auth, name) {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        alert("Error updating name!", error.message);
        console.log(error.message);
        // ...
      });
  }
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

        setTimeout(() => {
          updateName(auth, updatedName);
        }, 3000);
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
    <div
      style={{
        display: "flex",
        height: "70vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* create a form to accept email and password */}
      <form>
        <label>Name:</label>
        <input
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />

        <br></br>
        <label>Email:</label>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br></br>
        <label>Password:</label>
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
