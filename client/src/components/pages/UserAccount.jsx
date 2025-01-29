import "./Account.css";
import React, { useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities";
import Post from "../modules/Post.jsx";
import { UserContext } from "../App.jsx";
import { useLocation } from "react-router-dom";
import "./UserAccount.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserAccount = (props) => {
  const { state } = useLocation(); // State passed from navigate
  const user_name = state.username;
  const [profileId, setProfileId] = useState("");
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(UserContext);
  const [currentUserName, setCurrentUserName] = useState("");
  const [description, setDescription] = useState("");
  const [following, setFollowing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  // Fetch current logged-in user's username
  useEffect(() => {
    if (userId) {
      get("/api/UserName", { user_id: userId })
        .then((user) => setCurrentUserName(user.name))
        .catch((err) => console.error("Error fetching username:", err));
    }
  }, [userId]);

  // Fetch profile ID of the user being viewed
  useEffect(() => {
    if (userId && user_name) {
      get("/api/ProfileId", { user_name: user_name })
        .then((res) => setProfileId(res.profileId))
        .catch((err) => console.error("Error fetching profile ID:", err));
    }
  }, [user_name, userId]);

  // Fetch description of the user being viewed
  useEffect(() => {
    if (profileId) {
      get("/api/description", { user: profileId })
        .then((res) => {
          if (res && res.description) {
            setDescription(res.description);
          } else {
            setDescription("No description available.");
          }
        })
        .catch((err) => {
          console.error("Error fetching description:", err);
          setDescription("Failed to load description.");
        });
    }
  }, [profileId]);

  // Fetch posts of the user being viewed
  useEffect(() => {
    if (profileId) {
      get("/api/UserPosts", { user: profileId })
        .then((postObjs) => {
          if (postObjs && postObjs.length) {
            let reversedPostsObjs = postObjs.reverse();
            setPosts(reversedPostsObjs.filter((post) => post.is_public));
          } else {
            setPosts([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching user posts:", err);
          setPosts([]);
        });
    }
  }, [profileId]);

  // Check if the logged-in user is following the viewed user
  useEffect(() => {
    if (userId && user_name) {
      get("/api/isFollowing", { currentUser: userId, user: user_name })
        .then((FollowingBool) => setFollowing(FollowingBool))
        .catch((err) => console.error("Error checking follow status:", err));
    }
  }, [userId, user_name]);

  // Fetch profile picture
  useEffect(() => {
    if (profileId) {
      fetch(`/api/user/${profileId}/profile-picture`)
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
  }, [profileId]);

  // Toggle follow/unfollow
  const toggleFollow = () => {
    const newFollow = !following;
    const endpoint = newFollow ? "/api/follow" : "/api/unfollow";
    post(endpoint, { currentUser: userId, user: user_name })
      .then((NewBool) => setFollowing(NewBool))
      .catch((err) => console.error("Error toggling follow status:", err));
  };

  // Split posts into two columns
  const splitPosts = (postsList) => {
    let postsEven = postsList.filter((_, index) => index % 2 === 0);
    let postsOdd = postsList.filter((_, index) => index % 2 !== 0);

    let postsListEven = postsEven.map((postObj) => (
      <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={currentUserName} />
    ));

    let postsListOdd = postsOdd.map((postObj) => (
      <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={currentUserName} />
    ));

    return [postsListEven, postsListOdd];
  };

  const DisplayList = splitPosts(posts);

  return (
    <div className="Account">
      <div className="Profile">
        <div className="TopSection">
          <div className="PictureContainer">
            <div className="ProfilePic">
              {profilePicture ? (
                <img src={profilePicture} alt="user profile pic" />
              ) : (
                <AccountCircleIcon
                  sx={{
                    width: "100%",
                    height: "100%",
                    color: "white",
                  }}
                />
              )}
            </div>
            <div className="UserNameAndEdit">
              <p>{user_name}</p>
              <button className="FollowButton" onClick={toggleFollow}>
                {following ? "Following" : "Follow"}
              </button>
            </div>
          </div>
          <div className="UserBio">
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className="postContainer">
        <div className="postSide">{DisplayList[0]}</div>
        <div className="postSide">{DisplayList[1]}</div>
      </div>
    </div>
  );
};

export default UserAccount;
