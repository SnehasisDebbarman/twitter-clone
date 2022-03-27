import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const auth = getAuth();
  let navigate = useNavigate();
  //get current user
  const user = auth.currentUser;

  // write a logout button function
  const logout = () => {
    signOut(auth)
      .then(() => {
        alert("Logout Successfully");
        navigate("../", { replace: true });
      })
      .catch((error) => {
        // An error happened.
        alert(error.message);
      });
  };
  return (
    <div>
      <h1>Main Page</h1>
      <h2>Welcome {user.displayName}</h2>
      <button onClick={logout}>Logout</button>

      <h3>{user.email}</h3>
      <img src={user.photoURL} alt="user" />
    </div>
  );
}
