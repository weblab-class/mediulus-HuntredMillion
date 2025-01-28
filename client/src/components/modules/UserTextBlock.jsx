import React from "react";
import UserName from './UserName'
import './UserTextBlock.css'

/**
 * A single comment on a fractal post.
 * 
 * @param {String} user_name The ID of the user who created the comment.
 * @param {String} content The content of the write
 */
const UserTextBlock = (props) => {
    console.log('userName', props.user_name)
    return (
      <div className="UserTextBlock">
        <UserName user_name = {props.user_name}/>
        <p>{props.content}</p>
      </div>
    );
  };
  
  export default UserTextBlock;