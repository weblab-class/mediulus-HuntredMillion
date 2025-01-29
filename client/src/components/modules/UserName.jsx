import React from "react";
import "./UserName.css";
import { useNavigate } from "react-router-dom";

/**
 * A single comment on a fractal post.
 *
 * @param {String} user_name The name of the user who created the comment.
 */
const UserName = (props) => {
  const navigate = useNavigate();

  const goToProfile = (username) => {
    const formattedUsername = username.replace(/\s+/g, "");
    navigate(`/${formattedUsername}`, { state: { username } });
  };

  return (
    <div className="UserName" onClick={() => goToProfile(props.user_name)}>
      <p>{props.user_name}</p>
    </div>
  );
};

export default UserName;
