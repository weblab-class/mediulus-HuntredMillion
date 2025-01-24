import React, { useState, useEffect } from "react";
import "./Feed.css";
import Post from "../modules/Post.jsx";
import { get } from "../../utilities";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";

const Feed = (props) => {
  /* State for posts */
  const [posts, setPosts] = useState([]);

  /* Fetch posts when the component mounts */
  useEffect(() => {
    document.title = "Post Feed";
    get("/api/posts")
      .then((postObjs) => {
        console.log('PostObjs:', postObjs)
        if (postObjs && postObjs.length) {
          let reversedpostObjs = postObjs.reverse();
          setPosts(reversedpostObjs);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
      });
  }, []);

  console.log("Post HEREEE: ", posts);

  let postsEven = posts.filter((_, index) => index % 2 === 0);
  let postsOdd = posts.filter((_, index) => index % 2 !== 0);

  
  let postsListEven = postsEven.map((postObj) => (
    <Post
      key={`Card_${postObj._id}`}
      _id={postObj._id}
      fractal_id={postObj.fractal_id}
      creator_id={postObj.creator_id}
      img_url={postObj.img_url}
      likes={postObj.likes}
      userId={props.userId}
      description={postObj.description}
    />
  ));

  let postsListOdd = postsOdd.map((postObj) => (
    <Post
      key={`Card_${postObj._id}`}
      _id={postObj._id}
      fractal_id={postObj.fractal_id}
      creator_id={postObj.creator_id}
      img_url={postObj.img_url}
      likes={postObj.likes}
      userId={props.userId}
      description={postObj.description}
    />
  ));

  console.log("Posts (Even):", postsEven);
  console.log("Posts (Odd):", postsOdd);
  console.log("Posts List (Even Components):", postsListEven);
  console.log("Posts List (Odd Components):", postsListOdd);
  /* State for toggling the custom display */
  const [showCustomDisplay, setShowCustomDisplay] = useState(false);

  const toggleCustomDisplay = () => {
    setShowCustomDisplay(!showCustomDisplay);
  };

  const hideCustomDisplay = () => {
    setShowCustomDisplay(false);
  };

  return (
    <div className="Container">
      <div className="Buttons">
        <button className="CustomFeed" onClick={toggleCustomDisplay}>
          Customize Feed
        </button>
        <div className={`CustomDisplay ${showCustomDisplay ? "visible" : ""}`}>
          <IconButton className = 'MinusButton' onClick={hideCustomDisplay}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <div className="DisplayButton">
            <p onClick={hideCustomDisplay}>Trending</p>
            <p onClick={hideCustomDisplay}>Following</p>
          </div>
        </div>
      </div>
      <div className="postGallery">
        <div className="postGallery1">{postsListEven}</div>
        <div className="postGallery2">{postsListOdd}</div>
      </div>
    </div>
  );
};

export default Feed;
