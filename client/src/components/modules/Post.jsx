import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Comment from "./Comment";
import { IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./Post.css";
import UserTextBlock from './UserTextBlock.jsx'
import { motion } from "framer-motion";


const Post = (props) => {
/**
 * A single comment on a fractal post.
 * 
 * @param {String} _id The fractal id itself
 * @param {String} creator_id The content of the fractal
 * @param {String} img_url Fractal url
 * @param {String} likes The number of likes the fractal has
 * @param {String} userId The current user
 * @param {String} description The caption on the fractal
 * @param {String} userName the name of the current user
 * @param {Boolean} is_public
 */
  ///////////////////////////////
  //Things to do with comments//
  ///////////////////////////////
  const [comments, setComments] = useState([]);
  const [seeComments, setSeeComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  //Getting the comments for the post//
  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
  }, [parent]);

  //Tells whether the comments should be showing or not//
  const toggleComments = () => {
    setSeeComments(!seeComments);
  };

  //Creates the list of comments//
  const commentsList = comments.map((commentObj) => (
    <Comment
      key={`Card_${commentObj._id}`}
      fractal_id={commentObj._id}
      content={commentObj.content}
      creator_name = {commentObj.creator_name}
    />
  ));

  //Adds a new commment to a post//
  const addComment = () => {
    if (newComment.trim() === "") return; 
      const body = {
      parent: props._id, 
      content: newComment,
      creator: props.userName,
    };

    //adds the comment to the data base
    post("/api/comment", body).then((comment) => {
      setComments((prevComments) => [...prevComments, comment]);
      setNewComment(""); 
    });
  };

  ///////////////////////////////
  //Things to do with likes//
  ///////////////////////////////
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.likes);

  useEffect(() => {
    get('/api/isLiked', {fractal: props._id, user: props.userId}).then((likeBool) =>
    setLiked(likeBool));
  }, []);
 
  
  // Toggle between liked/unliked
  const toggleLiked = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    // Call the correct endpoint based on the new liked state
    const endpoint = newLiked ? "/api/like" : "/api/unlike";
    post(endpoint, { parent: props._id, user: props.userId })
      .then((response) => {
        setLikes(response.likes); // Update likes with the new count from the backend
      });
  };

  return (
     
      <div className="PostContainer">
         <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
        {!seeComments ? (

           // This is the Post Container //
          <div className="PostView">
            <img className="FractalImage" alt="Fractal" />

            <div className="ContentContainer">
    
              <UserTextBlock user_name = {props.creator_id} content = {props.description}/>

              {props.is_public && ( // Conditionally render LikeAndComment only if is_public is true
              <div className="LikeAndComment">
                <IconButton onClick={toggleComments}>
                  <ChatBubbleOutlineIcon className="CommentButton" />
                </IconButton>
                <IconButton onClick={toggleLiked}>
                  {liked ? (
                    <FavoriteIcon className="Liked" />
                  ) : (
                    <FavoriteBorderIcon className="Unliked" />
                  )}
                </IconButton>
                <p className="NumberOfLikes">{likes}</p>
              </div>
            )}
            </div>
          </div>
          ///////////////////////////////
        ) : (
          // Render the comments
            <div className="CommentsView">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="CommentsView"
              >
              <div className="FractalCreater">
                <UserTextBlock user_name={props.creator_id} content={props.description} />
                <div className="ExitContainer">
                  <button className="ExitButton" onClick={toggleComments}>
                    Exit
                  </button>
                </div>
              </div>
              <hr />
              {/* Scrollable comments area */}
              <div className="CommentsList">
                {commentsList}
              </div>
              {/* Add comment area always visible */}
              <div className="AddCommentContainer">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                <button onClick={addComment} className="SubmitButton">
                  Submit
                </button>
              </div>
              </motion.div>
            </div>
          
        )}
        </motion.div>
      </div>
  );
};

export default Post;
