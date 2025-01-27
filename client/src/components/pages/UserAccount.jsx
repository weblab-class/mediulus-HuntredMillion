import "./Account.css";
import React, { useState, useEffect, useContext } from "react";
import { get, post } from "../../utilities";
import Post from "../modules/Post.jsx";
import { UserContext } from "../App.jsx";

import { useLocation } from "react-router-dom";

const UserAccount = (props) => {
  const { state } = useLocation(); // State passed from navigate
  const user_name = state.username;
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(UserContext);
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    if (userId) {
      get("/api/UserName", { user_id: userId })
        .then((user) => {
          "Here is the userName:", user;
          setCurrentUserName(user.name);
        })
        .catch((err) => {
          console.error("Error fetching username:", err);
        });
    } else {
      console.log("userId is undefined; not fetching username.");
    }
  }, [userId]);

  useEffect(() => {
    if (user_name) {
      get("/api/UserPosts", { user: user_name }).then((postObjs) => {
        if (postObjs && postObjs.length) {
          let reversedpostsObjs = postObjs.reverse();
          setPosts(reversedpostsObjs.filter((post) => post.is_public));
        } else {
          setPosts([]);
        }
      });
    }
  }, [user_name]);

  let postsList = posts.map((postObj) => (
    <Post
      key={`Card_${postObj._id}`}
      _id={postObj._id}
      creator_id={postObj.creator_id}
      img_url={postObj.img_url}
      likes={postObj.likes}
      is_public={postObj.is_public}
      userId={userId}
      userName={currentUserName}
      description={postObj.description}
    />
  ));

  const [following, setFollowing] = useState(false);

  useEffect(() => {
    get("/api/isFollowing", { currentUser: userId, user: user_name }).then((FollowingBool) =>
      setFollowing(FollowingBool)
    );
  }, [userId, user_name]);

  const toggleFollow = () => {
    const newFollow = !following;

    const endpoint = newFollow ? "/api/follow" : "/api/unfollow";
    post(endpoint, { currentUser: userId, user: user_name }).then((NewBool) => {
      setFollowing(NewBool);
    });
  };

  return (
    <div className="Account">
      <div className="Profile">
        <div className="TopSection">
          <div className="PictureContainer">
            <div className="ProfilePic">
              <img src="../imgs/osu.jpeg" alt="user profile pic" />
            </div>
            <div className="UserNameAndEdit">
              <p>{user_name}</p>
              <button onClick={toggleFollow}>{following ? "Following" : "Follow"}</button>
            </div>
          </div>
          <div className="UserBio">
            <p>Here is a bunch of random text</p>
          </div>
        </div>
      </div>
      <div>{postsList}</div>
    </div>
  );
};

export default UserAccount;
