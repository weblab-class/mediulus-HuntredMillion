import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import './UserName.css'
import IconButton from "@mui/material/IconButton";
import { useNavigate } from 'react-router-dom';

/**
 * A single comment on a fractal post.
 * 
 * @param {String} user_name The ID of the user who created the comment.
 */
const UserName = (props) => {
    const navigate = useNavigate();

    const goToProfile = (username) => {
      const formattedUsername = username.replace(/\s+/g, ''); // Format the URL
      navigate(`/${formattedUsername}`, { state: { username } }); // Pass full username in state
    };
  
    return (
      <div className="UserName">
        <p>{props.user_name}</p>
        {console.log('username',props.user_name.replace(/\s+/g, ""))}
        <IconButton onClick={() => goToProfile(props.user_name)}>
          <PersonOutlineIcon  className = "icon"/>
        </IconButton>
      </div>
    );
  };
  
  export default UserName;