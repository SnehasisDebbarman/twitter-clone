import React, { useState } from "react";
import { db } from "../fb";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import "./posts.css";
//import iconns
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
//react switch
import Switch from "react-switch";
import Post from "./Post";

export default function Posts({ change }) {
  //create style

  //posts hook
  const [posts, setPosts] = React.useState([]);
  //post hook
  const [p, setPost] = React.useState(null);
  //show Single Post
  const [showSinglePost, setShowSinglePost] = React.useState(false);
  const [selfPost, setSelfPost] = useState(false);
  const [switchSeeAllPost, setSwitchSeeAllPost] = useState(true);
  React.useEffect(() => {
    getAllPosts();
  }, [change, posts]);

  //handle switch
  const handleSwitchChange = () => {
    setSelfPost(!selfPost);
    setSwitchSeeAllPost(!switchSeeAllPost);
  };

  //get all posts
  async function getAllPosts() {
    const postList = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      postList.push({ ...doc.data(), id: doc.id });
    });
    postList.sort((a, b) => {
      return b.time.seconds - a.time.seconds;
    });
    selfPost
      ? setPosts(
          postList.filter((post) => post.userId === getAuth().currentUser.uid)
        )
      : setPosts(postList);
  }
  //seconds to date converter
  function secondsToDate(seconds) {
    var d = new Date(0);
    d.setSeconds(seconds);
    return d;
  }
  // count how many hours ago if greater than 24 hours ago show date
  function timeAgo(time) {
    const now = new Date();
    const seconds = (now.getTime() - time.getTime()) / 1000;
    if (seconds < 60) {
      return Math.round(seconds) + " s";
    }
    if (seconds < 3600) {
      return Math.round(seconds / 60) + " mins";
    }
    if (seconds < 86400) {
      return Math.round(seconds / 3600) + " hrs";
    }
    if (seconds < 604800) {
      return Math.round(seconds / 86400) + " d";
    }
    if (seconds < 2419200) {
      return Math.round(seconds / 604800) + " wk";
    }
    if (seconds < 29030400) {
      return Math.round(seconds / 2419200) + " mnths";
    }
    return Math.round(seconds / 29030400) + " yrs";
  }
  const handlePostClick = (post) => {
    setPost(post);
    setShowSinglePost(true);
  };

  async function updatePostLikesCount(post) {
    const pid = post.postId;
    const q = query(collection(db, "posts"), where("postId", "==", pid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((document) => {
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      // doc.data() is never undefined for query doc snapshots
      console.log(document.id, " => ", document.data());
      console.log(userId);
      const docRef = doc(db, "posts", document.id);
      let newPostLikes = post.postLikes;

      newPostLikes.push(userId);
      let npl = [...new Set(newPostLikes)];

      console.log(document.data());
      console.log(post);
      const docData = {
        ...post,
        postLikes: npl,
      };

      setDoc(docRef, docData);
    });
  }

  return (
    <div>
      {!showSinglePost ? (
        <div className="post-cards-container">
          <div className="post-heading">
            <h3>Feeds </h3>
            <label className="post-seeAll-switch-container">
              <Switch
                onChange={handleSwitchChange}
                checked={switchSeeAllPost}
              />
              <span>See All</span>
            </label>
          </div>
          {posts.map((post, index) => {
            return (
              <div
                className="post-card"
                key={index}
                onClick={() => handlePostClick(post)}
              >
                <div className="post-card-body">
                  <div className="post-flex">
                    <img
                      src={
                        post.photoURL
                          ? post.photoURL
                          : "https://i.imgur.com/2Y8WQYv.png"
                      }
                      alt="user"
                    />
                  </div>
                  <div>
                    <p className="post-username">
                      {post.userName}
                      <span className="post-hours">
                        {timeAgo(secondsToDate(post.time.seconds))}
                      </span>
                    </p>
                    <span
                      className="post-body"
                      style={{ whiteSpace: "pre-warp" }}
                    >
                      {
                        //convert this text into multiple lines
                        post.postText.split("\n").map((item, index) => {
                          return (
                            <span key={index}>
                              {item}
                              <br />
                            </span>
                          );
                        })
                      }
                    </span>
                    <button
                      className="post-like-btn"
                      onClick={(item) => {
                        updatePostLikesCount(post);
                      }}
                    >
                      {post.postLikes.includes(getAuth().currentUser.uid) ? (
                        <FcLike />
                      ) : (
                        <FcLikePlaceholder />
                      )}
                    </button>
                    <span className="post-like-count">
                      {" "}
                      {"  " + post.postLikes.length}
                    </span>
                  </div>
                  {/* <div className="id">{post.id}</div> */}
                  {/*
                   * do this when you solve the problem of the image not showing
                   */}
                  {/* <div>
                {post.postImage && (
                  <img className="post-image" src={post.postImage} alt="post" />
                )}
              </div> */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Post
          post={p}
          showSinglePost={showSinglePost}
          setShowSinglePost={setShowSinglePost}
        />
      )}
    </div>
  );
}
