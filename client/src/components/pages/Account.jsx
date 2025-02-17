import "./Account.css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx";
import { get, post } from "../../utilities";
import Post from "../modules/Post.jsx";
import Following from "../modules/Following.jsx";
import Followers from "../modules/Followers.jsx";
import { processProfileImage } from "../../utils/imageUtils.js";
import DoneBkgd from "../imgs/DoneBkgd.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  const [profilePicture, setProfilePicture] = useState(null);

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
    if (userId) {
      get("/api/allPosts", { userId: userId })
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
  }, [userId]);

  // Fetch bio description
  useEffect(() => {
    get("/api/description", { user: userId })
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
  }, [userId]);

  // Add useEffect to fetch profile picture
  useEffect(() => {
    if (userId) {
      fetch(`/api/user/${userId}/profile-picture`)
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
  }, [userId]);

  // Toggle editing
  const toggleEditing = () => {
    if (editing) {
      post("/api/changeBio", { user: userId, bio: newDescription })
        .then((response) => {
          if (response && response.description) {
            setDescription(response.description);
          }
        })
        .catch((err) => console.error("Error updating bio:", err));
    } else {
      setNewDescription(description);
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

  // Function to split posts into even and odd lists
  const splitPosts = (postsList) => {
    let postsEven = postsList.filter((_, index) => index % 2 === 0);
    let postsOdd = postsList.filter((_, index) => index % 2 !== 0);

    let postsListEven = postsEven.map((postObj) => (
      <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={userName} />
    ));

    let postsListOdd = postsOdd.map((postObj) => (
      <Post key={`Card_${postObj._id}`} {...postObj} userId={userId} userName={userName} />
    ));

    return [postsListEven, postsListOdd];
  };

  // Dynamically determine posts to display based on `postType`
  let DisplayedPosts = [];
  if (postType === "all") {
    DisplayedPosts = splitPosts(posts);
  } else if (postType === "private") {
    DisplayedPosts = splitPosts(privatePosts);
  } else if (postType === "public") {
    DisplayedPosts = splitPosts(publicPosts);
  }

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const processedImage = await processProfileImage(file);

      const formData = new FormData();
      formData.append("profile_picture", processedImage);

      const response = await fetch(`/api/user/${userId}/profile-picture`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Force reload of profile picture by updating state
        setProfilePicture(URL.createObjectURL(processedImage));
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

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
                    color: "white", // or any color you prefer
                  }}
                />
              )}
              {editing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                    id="profile-picture-input"
                  />
                  <label htmlFor="profile-picture-input" className="change-picture-button">
                    Change Picture
                  </label>
                </>
              )}
            </div>
            <div className="UserNameAndEdit">
              <p className="userName">{userName}</p>
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
                className="custom-bio"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = "auto"; // Reset height to calculate the full height
                  e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on content
                }}
                placeholder="Write something about yourself..."
              ></textarea>
            ) : (
              <p className="bio">{description || "No bio available."}</p>
            )}
          </div>
        </div>
      </div>
      <div className="UserSelectedFractals">
        <div className="FractalSide">{DisplayedPosts[0]}</div>
        <div className="FractalSide">{DisplayedPosts[1]}</div>
      </div>
      {popUp && (
        <div className="Overlay" onClick={closePopUp}>
          <div className="FollowPopUp" onClick={(e) => e.stopPropagation()}>
            <div className="Exit">
              <button onClick={closePopUp}>Exit</button>
            </div>
            {popUpType === "following" && <Following />}
            {popUpType === "followers" && <Followers />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
