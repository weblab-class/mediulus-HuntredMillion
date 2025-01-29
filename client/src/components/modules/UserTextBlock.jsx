import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserName.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import UserName from "./UserName";
import "./UserTextBlock.css";

/**
 * A single comment on a fractal post.
 *
 * @param {String} user_name The ID of the user who created the comment.
 * @param {String} content The content of the write
 * @param {String} creator_id The ID of the user who created the post
 */
const UserTextBlock = (props) => {
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const goToProfile = (username) => {
    const formattedUsername = username.replace(/\s+/g, "");
    navigate(`/${formattedUsername}`, { state: { username } });
  };

  useEffect(() => {
    if (props.creator_id) {
      fetch(`/api/user/${props.creator_id}/profile-picture`)
        .then((response) => {
          if (response.ok) {
            return response.blob();
          }
          throw new Error("Profile picture not found");
        })
        .then((blob) => {
          setProfilePicture(URL.createObjectURL(blob));
        })
        .catch(() => {
          setProfilePicture(null);
        });
    }
  }, [props.creator_id]);

  return (
    <div className="UserTextBlock">
      <div className="UserInfo">
        <Tooltip title="View Account">
          <div
            onClick={() => goToProfile(props.user_name)}
            className="profile-link"
            style={{ cursor: "pointer" }}
          >
            {profilePicture ? (
              <img src={profilePicture} alt={props.user_name} className="profile-icon" />
            ) : (
              <AccountCircleIcon className="profile-icon" />
            )}
          </div>
        </Tooltip>
        <UserName user_name={props.user_name} />
      </div>
      <p className="content">{props.content}</p>
    </div>
  );
};

export default UserTextBlock;
