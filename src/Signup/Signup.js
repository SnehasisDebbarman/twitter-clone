import React, { useState, useEffect } from "react";
//Redirect of
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../fb";
import profileIcon from "../assets/profile.png";
import "./signup.css";

export default function Signup() {
  //
  const [user, setUser] = useState(null);
  //usestate for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //updated name
  const [updatedName, setUpdatedName] = useState("");
  const [auth, setAuth] = useState(getAuth());
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  //add user
  const addUser = async (user) => {
    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, {
          userId: user.uid,
          userName: user.displayName ? user.displayName : "Anonymous",
          email: user.email,
          time: Timestamp.now(),
          photoURL: user.photoURL ? user.photoURL : profileIcon,
        })
      ).then(() => {});
      console.log("user added written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

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
  useEffect(() => {
    if (user) {
      navigate("../main", { replace: true });
    }
  }, [user]);

  // Sign in with email
  const signInWithEmail = (e) => {
    setLoading(true);
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  // Sign in with email and password
  const signInWithEmailAndPassword = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        //adding user information in database

        //updated the name
        updateName(auth, updatedName);
        setTimeout(() => {
          setUser(user);
        }, 3000);
        setLoading(false);

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
      <form className="signup-form">
        <h3>Sign Up</h3>
        <input
          placeholder="name"
          type="text"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />

        <input
          type="email"
          placeholder="email"
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
}
