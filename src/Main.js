import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import profileIcon from "./assets/profile.png";
import { db } from "./fb";
import { doc, collection, addDoc, setDoc, Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Posts from "./Posts/Posts";
import UserList from "./Users/UserList";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";

export default function Main() {
  const mAuth = getAuth();

  const [auth, setAuth] = useState(mAuth);

  //name hook
  const [updatedName, setName] = useState("");
  //showedit hoook
  const [showEdit, setShowEdit] = useState(false);
  //post Hook
  const [post, setPost] = useState("");
  //images hook
  const [images, setImages] = useState([]);
  //imageUrls hook
  const [imageUrls, setImageUrls] = useState([]);
  //change detect hook
  const [change, setChange] = useState(false);
  //namechange detect hook
  //const [nameChange, setNameChange] = useState(false);
  //usestate for user
  const [user, setUser] = React.useState(mAuth.currentUser);
  //showMenu usestate
  const [showMenu, setShowMenu] = React.useState(false);
  //selfpost hook

  //saving auth in auth hook
  // useEffect(() => {
  //   onAuthStateChanged((cauth) => {
  //     const mauth = getAuth();
  //     setAuth(mauth);
  //     if (mauth) {
  //       setUser(mauth.currentUser);
  //     }
  //   });
  // }, []);

  let navigate = useNavigate();

  // updating the name of the user
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
  // write a fns to count the character of the post
  function countChar(post) {
    return post.length;
  }

  //useEffect hook for save image into image urls
  useEffect(() => {
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        //!also change this and make sure it is the uplod into right url
        setImageUrls((prev) => [...prev, URL.createObjectURL(images[i])]);
      }
    }
  }, [images]);

  //preserve user after refresh
  useEffect(() => {
    console.count();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // User is signed out
        navigate("../");
      }
    });
  }, []);
  //add user effect
  useEffect(() => {
    const addUser = async () => {
      try {
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          userName: user.displayName ? user.displayName : "Anonymous",
          email: user.email,
          time: Timestamp.now(),
          photoURL: user.photoURL ? user.photoURL : profileIcon,
        }).then(() => {
          console.log("user added");
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    if (user) {
      addUser();
    }
  }, [user]);

  //update name function
  const updateNameFunc = (e) => {
    e.preventDefault();
    updateName(auth, updatedName);
    setShowEdit(false);
  };

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
      await addDoc(collection(db, "posts"), {
        postId: uuidv4(),
        userId: user.uid,
        userName: user.displayName ? user.displayName : "Anonymous",
        email: user.email,
        postText: post,
        time: Timestamp.now(),
        photoURL: user.photoURL ? user.photoURL : profileIcon,
        //!should change this because it is not the real image link
        postImage: imageUrls,
        postLikes: [],
      }).then(() => {
        setPost("");
        setImages([]);
        setImageUrls([]);
        setChange(!change);
      });

      setPost("");
      setImages([]);
      setImageUrls([]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  function onImageChange(e) {
    setImages([]);
    setImageUrls([]);
    setImages([e.target.files[0]]);
  }

  //handle menu function
  const handleMenu = () => {
    setShowMenu(!showMenu);
  };
  const uploadImage = (
    <div>
      <label
        htmlFor="filePicker"
        style={{ background: "grey", padding: "5px 10px" }}
      >
        Choose
      </label>
      <input
        id="filePicker"
        style={{ visibility: "hidden" }}
        className="main-image-input"
        type="file"
        placeholder="Add a photo"
        text="Add a photo"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
  const showUploadedImage = (
    <div className="main-input-image-container">
      {imageUrls.map((imageUrl) => {
        console.log(imageUrl);
        return <img className="main-input-image" src={imageUrl} alt="user" />;
      })}
    </div>
  );
  return (
    <>
      {user && (
        <div className="main-container">
          <div className="main-container-left">
            {user && (
              <div className="main-card">
                <div className="main-card-body">
                  <div className="main-user-info-container">
                    <img
                      className="main-user-img"
                      src={user.photoURL ? user.photoURL : profileIcon}
                      alt="user"
                    />
                    <h5 className="main-card-title">{user.displayName}</h5>
                    <p className="main-card-text">{user.email}</p>
                    <button className="main-btn" onClick={logout}>
                      Logout
                    </button>
                  </div>
                  {/**
                   ** TODO : incomment this when you solve the image issue
                   */}
                  {/* {!showEdit && (
                <button
                  className="main-btn"
                  onClick={() => setShowEdit(!showEdit)}
                >
                  Edit
                </button>
             */}
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

                  <UserList />
                </div>
              </div>
            )}
          </div>
          <div className="main-container-body">
            <div className="main-heading">
              <h3>Home </h3>
              {/* create a hamburger menu */}
              <div className="main-container-hamburger" onClick={handleMenu}>
                {/* <div className="main-container-hamburger-line"></div>
            <div className="main-container-hamburger-line"></div>
            <div className="main-container-hamburger-line"></div> */}
                {!showMenu ? <GiHamburgerMenu /> : <ImCross />}
              </div>
            </div>

            <div>
              {/* write jsx user image with input */}
              {user && (
                <div className="input-container">
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
                      onChange={(e) => {
                        //create a program which convert user-entered whitespace to a template literal
                        //and then convert it back to a string
                        setPost(e.target.value);
                      }}
                    />
                    {/*
                     *! TODO: should change this to a function when you solved upload image problem
                     */}
                    {/* {uploadImage}

                <div></div>
                <div></div>
                {showUploadedImage} */}

                    {/* post button */}
                  </div>
                  <div className="main-post-btn-container">
                    <button
                      disabled={countChar(post) < 1 ? true : false}
                      className="main-input-btn"
                      onClick={updatePost}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
              {/* write jsx post */}
              <div className="main-post-container">
                <Posts change={change} />
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
                      <h5 className="main-menu-user-name">
                        {user.displayName}
                      </h5>
                      <p className="main-menu-user-name">{user.email}</p>
                      {/* 
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
                  )} */}
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
      )}
    </>
  );
}
