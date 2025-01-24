import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import "./Comment.css";

/**
 * A single comment on a fractal post.
 * 
 * @param {String} creator_id The ID of the user who created the comment.
 * @param {String} fractal_id The ID of the fractal this comment belongs to.
 * @param {String} content The text content of the comment.
 */
const Comment = (props) => {
  console.log('inside comment')
  console.log("this is the content: ", props.content)
    return (
      <div className="CommentContainer">
        <PersonOutlineIcon />
        <div className="CommentDetails">
          <p>{props.creator_id}</p>
          <p>{typeof props.content === "string" ? props.content : "Invalid content"}</p>
        </div>
      </div>
    );
  };
  
  export default Comment;
  