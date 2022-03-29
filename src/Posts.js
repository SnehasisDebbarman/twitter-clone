import React from "react";
import { db } from "./fb";
import { collection, getDocs } from "firebase/firestore";
import "./styles/posts.css";

export default function Posts() {
  //create style

  //posts hook
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    getAllPosts();
  }, []);

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

    setPosts(postList);
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
  return (
    <div className="post-cards-container">
      <div className="post-heading">
        <h3>Feeds </h3>
      </div>
      {posts.map((post, index) => {
        console.log(post.photoURL);
        return (
          <div className="post-card" key={index}>
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
                <span className="post-body" style={{ whiteSpace: "pre-warp" }}>
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
  );
}
