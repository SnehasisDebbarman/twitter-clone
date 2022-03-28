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
      return Math.round(seconds) + " seconds ago";
    }
    if (seconds < 3600) {
      return Math.round(seconds / 60) + " minutes ago";
    }
    if (seconds < 86400) {
      return Math.round(seconds / 3600) + " hours ago";
    }
    if (seconds < 604800) {
      return Math.round(seconds / 86400) + " days ago";
    }
    if (seconds < 2419200) {
      return Math.round(seconds / 604800) + " weeks ago";
    }
    if (seconds < 29030400) {
      return Math.round(seconds / 2419200) + " months ago";
    }
    return Math.round(seconds / 29030400) + " years ago";
  }
  return (
    <div className="post-cards-container">
      {posts.map((post, index) => (
        <div className="post-card" key={index}>
          <div className="post-card-body">
            <div className="post-flex">
              <img src={post.photoURL} alt={post.userName} />
              <h4>{post.userName}</h4>
            </div>

            <h3 className="post-body">{post.postText}</h3>
            <p>Posted on {timeAgo(secondsToDate(post.time.seconds))}</p>

            {/* <div className="id">{post.id}</div> */}
          </div>
        </div>
      ))}
    </div>
  );
}
