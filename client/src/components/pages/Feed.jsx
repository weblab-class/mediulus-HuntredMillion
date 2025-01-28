import React, { useState, useEffect, useContext } from "react";
import "./Feed.css";
import Post from "../modules/Post.jsx";
import { get } from "../../utilities";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import { UserContext } from "../App.jsx";
import SearchIcon from "@mui/icons-material/Search";
import UserName from "../modules/UserName.jsx";

const Feed = (props) => {
  /* State for posts */
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [followingList, setFollowingList] = useState([]);
  
      useEffect(() => {
        if (!userId) {
            console.log('userId is not available yet');
            return;
        }
        get('/api/findFollowing', {user:userId})
            .then((following) => {
                if (following) {
                    setFollowingList(following);
                } else {
                    console.log('No following data received');
                    setFollowingList([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching following list:', error);
                setFollowingList([]); // Handle errors
            });
    }, [userId]);

  /* Fetch posts when the component mounts */
  useEffect(() => {
    document.title = "Post Feed";

    if (userId) {
      get("/api/UserName", { user_id: userId })
        .then((user) => {
          setUserName(user.name);
        })
        .catch((err) => console.error("Error fetching username:", err));
    }

    get("/api/Publicposts")
      .then((postObjs) => {
        if (postObjs && postObjs.length) {
          let reversedPostObjs = postObjs.reverse();
          setPosts(reversedPostObjs);
        } else {
          setPosts([]);
        }
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, [userId]);

  /* Split posts into even and odd indexes */
  const splitPosts = (postsList) => {
    let postsEven = postsList.filter((_, index) => index % 2 === 0);
    let postsOdd = postsList.filter((_, index) => index % 2 !== 0);

    let postsListEven = postsEven.map((postObj) => (
      <Post
        key={`Card_${postObj._id}`}
        {...postObj}
        userId={userId}
        userName={userName}
      />
    ));

    let postsListOdd = postsOdd.map((postObj) => (
      <Post
        key={`Card_${postObj._id}`}
        {...postObj}
        userId={userId}
        userName={userName}
      />
    ));

    return [postsListEven, postsListOdd];
  };

  const PublicDisplay = splitPosts(posts);

  
  /* State for toggling the custom display */
  const [showCustomDisplay, setShowCustomDisplay] = useState(false);

  const toggleCustomDisplay = () => {
    setShowCustomDisplay(!showCustomDisplay);
  };

  const hideCustomDisplay = () => {
    setShowCustomDisplay(false);
  };

  /* State for toggling the search textarea */
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showUserName, setShowUserName] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setShowUserName(false);
  };

  const handleFindUser = () => {
    if (searchText.trim() === "") {
      console.log("Please enter a username.");
      setShowUserName(false);
    } else {
      console.log("Finding user:", searchText);
      setShowUserName(true);
    }
  };

  return (
    <div className="Container">
      <div className="Buttons">
        <div className="Filter">
          <button className="CustomFeedButton" onClick={toggleCustomDisplay}>
            Customize Feed
          </button>

          <div
            className={`CustomDisplayButton ${
              showCustomDisplay ? "visible" : ""
            }`}
          >
            <IconButton className="MinusButton" onClick={hideCustomDisplay}>
              <RemoveCircleOutlineIcon fontSize="50px" />
            </IconButton>

            <div className="DisplayButton">
              <p onClick={hideCustomDisplay}>Trending</p>
              <p onClick={hideCustomDisplay}>Following</p>
            </div>
          </div>
        </div>

        <div className="SearchContainer">
          {showSearch && (
            <div className="SearchArea">
              <textarea
                className="SearchTextArea"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Find Friends"
              />
              <button className="FindUserButton" onClick={handleFindUser}>
                Find User
              </button>
              {showUserName && <UserName user_name={searchText} />}
            </div>
          )}
          <IconButton onClick={toggleSearch}>
            <SearchIcon className="SearchButton" />
          </IconButton>
        </div>
      </div>

      <div className="postGallery">
        <div className="postGallery1">{PublicDisplay[0]}</div>
        <div className="postGallery2">{PublicDisplay[1]}</div>
      </div>
    </div>
  );
};

export default Feed;

