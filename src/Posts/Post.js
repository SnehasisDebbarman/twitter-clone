import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { MdClose } from "react-icons/md";

function secondsToDate(seconds) {
  var d = new Date(0);
  d.setSeconds(seconds);
  return d;
}

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
export default function Post({ post, setShowSinglePost }) {
  useEffect(() => {
    console.log(post);
  }, [post]);
  return (
    <div className="post-card">
      {post && (
        <div className="post-card">
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
            <div
              style={{
                width: "90%",
              }}
            >
              <p className="post-username">
                <div>
                  {" "}
                  {post.userName}
                  <span className="post-hours">
                    {timeAgo(secondsToDate(post.time.seconds))}
                  </span>
                </div>

                <div className="post-cross">
                  <MdClose onClick={() => setShowSinglePost(false)} />
                </div>
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
              <button
                className="post-like-btn"
                onClick={(item) => {
                  //updatePostLikesCount(post);
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
      )}
    </div>
  );
}
