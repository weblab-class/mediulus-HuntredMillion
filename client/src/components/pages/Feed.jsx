import React, { useState, useEffect, useContext } from "react";
import "./Feed.css";
import Post from "../modules/Post.jsx";
import { get } from "../../utilities";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import { UserContext } from "../App.jsx"

const Feed = (props) => {
  /* State for posts */
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState('');

  useEffect (() => {
    console.log('here 1')
    if (userId) {
      get("/api/UserName", { user_id: userId })
        .then((user) => {
          console.log("Here is the userName:", user);
          setUserName(user.name); // Update state with the username
        })
        .catch((err) => {
          console.error("Error fetching username:", err);
        });
    }
  }, [userId])
  
  /* Fetch posts when the component mounts */
  useEffect(() => {
    document.title = "Post Feed";

    // Fetch posts
    get("/api/Publicposts")
      .then((postObjs) => {
        console.log("PostObjs:", postObjs);
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


  let postsEven = posts.filter((_, index) => index % 2 === 0);
  let postsOdd = posts.filter((_, index) => index % 2 !== 0);

  let postsListEven = postsEven.map((postObj) => (
    <Post
      key={`Card_${postObj._id}`}
      _id={postObj._id}
      creator_id={postObj.creator_id}
      img_url={postObj.img_url}
      is_public = {postObj.is_public}
      likes={postObj.likes}
      userId={userId}
      userName = {userName}
      description={postObj.description}
    />
  ));

  let postsListOdd = postsOdd.map((postObj) => (
    <Post
      key={`Card_${postObj._id}`}
      _id={postObj._id}
      creator_id={postObj.creator_id}
      img_url={postObj.img_url}
      is_public = {postObj.is_public}
      likes={postObj.likes}
      userId={userId}
      userName = {userName}
      description={postObj.description}
    />
  ));


  /* State for toggling the custom display */
  const [showCustomDisplay, setShowCustomDisplay] = useState(false);

  const toggleCustomDisplay = () => {
    console.log("Toggling showCustomDisplay");
    setShowCustomDisplay(!showCustomDisplay);
  };

  const hideCustomDisplay = () => {
    setShowCustomDisplay(false);
  };

  return (
    <div className="Container">
      <div className="Buttons">

        <button className="CustomFeedButton" onClick={toggleCustomDisplay}>
          Customize Feed
        </button>

        <div className={`CustomDisplayButton ${showCustomDisplay ? "visible" : ""}`}>
          <IconButton className = 'MinusButton' onClick={hideCustomDisplay}>
            <RemoveCircleOutlineIcon strokeWidth= '0.1' fontSize="50px" />
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
