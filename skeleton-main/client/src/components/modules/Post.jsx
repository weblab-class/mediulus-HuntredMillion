import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Comment from './Comment'
import { IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Post = (props) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [seeComments, setSeeComments] = useState(false);

  // Fetch comments for the post
  useEffect(() => {
    get('/api/comment', {parent: props.fractal_id}).then((comments) => {
      setComments(comments);
    });
  }, [parent]);

  console.log('Here are the comments:', comments)
  // Toggle between liked/unliked
  const toggleLiked = () => {
    setLiked(!liked);
  };

  // Toggle between showing post and comments
  const toggleComments = () => {
    setSeeComments(!seeComments);
  };
  
  // Render the list of comments
  const commentsList = comments.map((commentObj) => (
    <Comment
      key={`Card_${commentObj._id}`}
      creator_id={commentObj.creator_id}
      fractal_id={commentObj.fractal_id}
      content={commentObj.content}
    />
  ));

  return (
    <div className="Card">
      <div className="PostContainer">
        {!seeComments ? (
          // Render the post
          <div className="PostView">
            <div className="FractalContainer">
              <img className="FractalImage" alt="Fractal" />
            </div>
            <div className="ContentContainer">
              <p>{props.creator_id}</p>
              <p>{props.description}</p>
              <div className="LikeAndComment">
                <IconButton onClick={toggleComments}>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton onClick={toggleLiked}>
                  {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <p>{Array.isArray(props.likes) ? props.likes.length : "0"}</p>
              </div>
            </div>
          </div>
        ) : (
          // Render the comments
          <div className="CommentsView">
            <button onClick={toggleComments}>Exit</button>
            {commentsList}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;