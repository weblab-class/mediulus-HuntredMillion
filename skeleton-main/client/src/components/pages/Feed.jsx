import React, { useState } from "react";
import "./Feed.css";
import Post from "../modules/Post.jsx";
import { get } from "../../utilities";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const Feed = (props) => {
    /*This is the info for the content of the page*/
    const [posts, setPosts] = useState([]);

    // called when the "Feed" component "mounts", i.e.
    // when it shows up on screen
    useEffect(() => {
        document.title = "Post Feed";
        get("/api/posts").then((postObjs) => {
          let reversedpostObjs = postObjs.reverse();
          setPosts(reversedpostObjs);
        });
    }, []);

    let postsList = null;
    const hasPosts = posts.length !== 0;
    if (hasPosts) {
    postsList = posts.map((postObj) => (

      <Post
        key={`Card_${postObj._id}`}
        _id={postObj._id}
        fractal_id = {postObj.fractal_id}
        creator_id={postObj.creator_id}
        img_url = {postObj.img_url}
        likes = {postObj.likes}
        userId={props.userId}
        description={postObj.description}
      />
    
    ));
    } else {
        postsList = <div>No Post!</div>;
    }

    let postsListEven = [];
    let postsListOdd = [];
    for (let postObj of postsList) {
        if (parseInt(postObj._id) % 2 === 0) {
            postsListEven.push(postObj);
        } else {
            postsListOdd.push(postObj)
        }
    }

    /*This is the info for the button*/
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
                <button 
                    className="CustomFeed" 
                    onClick={toggleCustomDisplay}
                >
                    Customize Feed
                </button>
                <div 
                    className={`CustomDisplay ${showCustomDisplay ? "visible" : ""}`}
                >
                    <RemoveCircleOutlineIcon 
                        onClick={hideCustomDisplay}
                        style={{ cursor: "pointer" }}/>
                    <button className="DisplayButton">
                        <p onClick={hideCustomDisplay}>Trending</p>
                        <p onClick={hideCustomDisplay}>Following</p>
                    </button>
                </div>
            </div>

            <div className="postGallery">
                <div className="postGallery1">
                    {postsListEven}
                </div>
                <div clasName = "postGallery2">
                    {postsListOdd}
                </div>
            </div>
        </div>
    );
};

export default Feed;
