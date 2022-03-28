import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import profileIcon from "./assets/profile.png";
import { db } from "./fb";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Posts from "./Posts";

function updateName(auth, name) {
  updateProfile(auth.currentUser, {
    displayName: name,
  })
    .then(() => {
      // Profile updated!
      alert("Name updated!");
      // ...
    })
    .catch((error) => {
      // An error occurred
      alert("Error updating name!", error.message);
      console.log(error.message);
      // ...
    });
}

export default function Main() {
  //name hook
  const [updatedName, setName] = useState("");
  //showedit hoook
  const [showEdit, setShowEdit] = useState(false);
  //post Hook
  const [post, setPost] = useState("");
  const auth = getAuth();
  let navigate = useNavigate();
  //usestate for user
  const [user, setUser] = React.useState(auth.currentUser);
  //showMenu usestate
  const [showMenu, setShowMenu] = React.useState(false);
  //preserve user after refresh
  useEffect(() => {
    console.count();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setUser(user);
        // ...
      } else {
        // User is signed out
        navigate("/");
        // ...
      }
    });
  }, []);
  //update name function
  const updateNameFunc = (e) => {
    e.preventDefault();
    updateName(auth, updatedName);
    setShowEdit(false);
  };

  //
  const logout = () => {
    signOut(auth)
      .then(() => {
        // alert("Logout Successfully");
        // navigate("/");
      })
      .catch((error) => {
        // An error happened.
        alert(error.message);
      });
  };
  const updatePost = async () => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,
        userName: user.displayName ? user.displayName : "Anonymous",
        email: user.email,
        postText: post,
        time: Timestamp.now(),
        photoURL: user.photoURL ? user.photoURL : profileIcon,
      });
      console.log("Document written with ID: ", docRef.id);
      setPost("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  //handle menu function
  const handleMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="main-container">
      <div className="main-container-left">
        {user && (
          <div className="main-card">
            <div className="main-card-body">
              <img
                className="main-user-img"
                src={user.photoURL ? user.photoURL : profileIcon}
                alt="user"
              />
              <h5 className="main-card-title">{user.displayName}</h5>
              <p className="main-card-text">{user.email}</p>
              {!showEdit && (
                <button
                  className="main-btn"
                  onClick={() => setShowEdit(!showEdit)}
                >
                  Edit
                </button>
              )}
              {showEdit && (
                <>
                  <input
                    className="main-input"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />

                  <button
                    className="main-btn"
                    onClick={(e) => updateNameFunc(e)}
                  >
                    update Name
                  </button>
                </>
              )}
              <button className="main-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="main-container-body">
        <div className="main-heading">
          <h3>Home </h3>
          {/* create a hamburger menu */}
          <div className="main-container-hamburger" onClick={handleMenu}>
            <div className="main-container-hamburger-line"></div>
            <div className="main-container-hamburger-line"></div>
            <div className="main-container-hamburger-line"></div>
          </div>
        </div>

        <div>
          {/* write jsx user image with input */}
          {user && (
            <div className="input-post-holder">
              <img
                className="main-input-user-img"
                src={user.photoURL ? user.photoURL : profileIcon}
                alt="user"
              />
              <textarea
                className="main-input-post"
                type="text"
                placeholder="What's Happening?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              />
              {/* post button */}
              <div></div>
              <div className="main-post-btn-container">
                <button className="main-input-btn" onClick={updatePost}>
                  Post
                </button>
              </div>
            </div>
          )}
          {/* write jsx post */}
          <div className="main-post-container">
            <Posts />
          </div>

          {/* write jsx to for menu with user name email logout and edit button*/}
          {showMenu && (
            <div className="main-menu-container">
              <div className="main-menu-container-body">
                <div className="main-menu-container-body-user">
                  <img
                    className="main-menu-user-img"
                    src={user.photoURL ? user.photoURL : profileIcon}
                    alt="user"
                  />
                  <h5 className="main-menu-user-name">{user.displayName}</h5>
                  <p className="main-menu-user-name">{user.email}</p>

                  {!showEdit && (
                    <button
                      className="main-btn"
                      onClick={() => setShowEdit(!showEdit)}
                    >
                      Edit
                    </button>
                  )}
                  {showEdit && (
                    <>
                      <input
                        className="main-input"
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                      />

                      <button
                        className="main-btn"
                        onClick={(e) => updateNameFunc(e)}
                      >
                        update Name
                      </button>
                    </>
                  )}
                  <button className="main-btn" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
