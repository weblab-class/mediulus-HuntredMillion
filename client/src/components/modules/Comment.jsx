import React from "react";
import "./Comment.css";
import UserTextBlock from "./UserTextBlock.jsx";

/**
 * A single comment on a fractal post.
 *
 * @param {String} creator_name The ID of the user who created the comment.
 * @param {String} fractal_id The ID of the fractal this comment belongs to.
 * @param {String} content The text content of the comment.
 */
const Comment = (props) => {
  return (
    <div className="CommentContainer">
      <UserTextBlock user_name={props.creator_name} content={props.content} />
      <hr />
    </div>
  );
};

export default Comment;
