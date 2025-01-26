import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import './UserName.css'

/**
 * A single comment on a fractal post.
 * 
 * @param {String} user_name The ID of the user who created the comment.
 */
const UserName = (props) => {
    return (
      <div className="UserName">
        <p>{props.user_name}</p>
        <PersonOutlineIcon className = "icon"/>
      </div>
    );
  };
  
  export default UserName;