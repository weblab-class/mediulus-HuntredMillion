import "./Account.css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx";
import { get, post } from "../../utilities"; // Import both get and post
import Post from "../modules/Post.jsx";
import Following from "../modules/Following.jsx";
import Followers from "../modules/Followers.jsx";

const Account = (props) => {
  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([]);
  const [privatePosts, setPrivatePosts] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [postType, setPostType] = useState("all");
  const [popUp, setPopUp] = useState(false);
  const [popUpType, setPopUpType] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  // Fetch username
  useEffect(() => {
    if (userId) {
      get("/api/UserName", { user_id: userId })
        .then((user) => setUserName(user.name))
        .catch((err) => console.error("Error fetching username:", err));
    }
  }, [userId]);

  // Fetch posts
  useEffect(() => {
    if (userName) {
      get("/api/allPosts", { user: userName })
        .then((postObjs) => {
          if (postObjs && postObjs.length) {
            const reversedPosts = postObjs.reverse();
            setPosts(reversedPosts);
            setPrivatePosts(reversedPosts.filter((post) => !post.is_public));
            setPublicPosts(reversedPosts.filter((post) => post.is_public));
          } else {
            setPosts([]);
            setPrivatePosts([]);
            setPublicPosts([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setPosts([]);
          setPrivatePosts([]);
          setPublicPosts([]);
        });
    }
  }, [userName]);

  // Fetch bio description
  useEffect(() => {
    get("/api/description", { user: userId })
      .then((res) => {
        if (res && res.description) {
          setDescription(res.description); // Ensure the description is extracted properly
        } else {
          console.error("Invalid response format:", res);
          setDescription("No description available.");
        }
      })
      .catch((err) => {
        console.error("Error fetching description:", err);
        setDescription("Failed to load description.");
      });
  }, [userId]);

  // Toggle editing
  const toggleEditing = () => {
    if (editing) {
      post("/api/changeBio", { user: userId, bio: newDescription })
        .then((response) => {
          if (response && response.description) {
            setDescription(response.description); // Update bio in the frontend
          } else {
            console.error("Invalid response format:", response);
          }
        })
        .catch((err) => console.error("Error updating bio:", err));
    }
    setEditing(!editing);
  };

  // Toggle popup visibility
  const togglePopUp = (type) => {
    setPopUpType(type);
    setPopUp(!popUp);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  // Render posts
  const postsList = posts.map((postObj) => (
    <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={userName} />
  ));
  const PrivatePostsList = privatePosts.map((postObj) => (
    <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={userName} />
  ));
  const PublicPostsList = publicPosts.map((postObj) => (
    <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={userName} />
  ));

  return (
    <div className="Account">
      <div className="Profile">
        <div className="TopSection">
          <div className="PictureContainer">
            <div className="ProfilePic">
              <img src="/imgs/osu.jpeg" alt="user profile pic" />
            </div>
            <div className="UserNameAndEdit">
              <p>{userName}</p>
              <button className="editing" onClick={toggleEditing}>
                {editing ? "Save" : "Edit Profile"}
              </button>
            </div>
          </div>
          <div className="Settings">
            <button onClick={() => togglePopUp("followers")}>Followers</button>
            <button onClick={() => togglePopUp("following")}>Following</button>
            <button onClick={() => setPostType("all")}>Fractals</button>
            <button onClick={() => setPostType("private")}>Private Fractals</button>
            <button onClick={() => setPostType("public")}>Public Fractals</button>
          </div>
          <div className="UserBio">
            {editing ? (
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Write something about yourself..."
              ></textarea>
            ) : (
              <p>{description || "No bio available."}</p>
            )}
          </div>
        </div>
      </div>
      <div className="UserSelectedFractals">
        {postType === "all" && postsList}
        {postType === "private" && PrivatePostsList}
        {postType === "public" && PublicPostsList}
      </div>
      {popUp && (
        <div className="Overlay" onClick={closePopUp}>
          <div className="FollowPopUp" onClick={(e) => e.stopPropagation()}>
            <button onClick={closePopUp}>Exit</button>
            {popUpType === "following" && <Following />}
            {popUpType === "followers" && <Followers />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
