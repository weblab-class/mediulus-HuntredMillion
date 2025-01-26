import './Account.css'
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx"
import { get } from "../../utilities";
import Post from '../modules/Post.jsx'

const Account = (props) => {
    const { userId } = useContext(UserContext);
    const [userName, setUserName] = useState('');

    console.log("my username is:", userName);
    useEffect (() => {
        if (userId) {
          get("/api/UserName", { user_id: userId })
            .then((user) => {
              setUserName(user.name); // Update state with the username
            })
            .catch((err) => {
              console.error("Error fetching username:", err);
            });
        }
        
      }, [userId])


        const [posts, setPosts] = useState([]);

        useEffect(() => {
          // Fetch posts
          get("/api/allPosts", {user: userName})
            .then((postObjs) => {
              if (postObjs && postObjs.length) {
                let reversedpostObjs = postObjs.reverse();
                setPosts(reversedpostObjs);
    
              } else {
                setPosts([]);
              }
            })
            .catch((err) => {
              console.error("Error fetching posts:", err);
              setPosts([]);
            });
        }, [userName]);
        
        let postsEven = posts.filter((_, index) => index % 2 === 0);
        let postsOdd = posts.filter((_, index) => index % 2 !== 0);

        let postsListEven = postsEven.map((postObj) => (
            <Post
            key={`Card_${postObj._id}`}
            _id={postObj._id}
            creator_id={postObj.creator_id}
            img_url={postObj.img_url}
            likes={postObj.likes}
            is_public = {postObj.is_public}
            userId={userId}
            userName = {userName}
            description={postObj.description}
            />
        ));

        let postsListOdd = postsOdd.map((postObj) => (
            <Post
            key={`Card_${postObj._id}`}
            _id={postObj._id}
            creator_id={postObj.creator_id}
            img_url={postObj.img_url}
            likes={postObj.likes}
            is_public = {postObj.is_public}
            userId={userId}
            userName = {userName}
            description={postObj.description}
            />
        ));

    return (
        <div className='Account'>
            <div className="Profile">
                <div className="TopSection">
                    <div className='PictureContainer'>
                        <div className="ProfilePic">
                            <img src = '../imgs/osu.jpeg' alt = "user profile pic"/>
                        </div>
                        <div className = 'UserNameAndEdit'>
                            <p>{userName}</p>
                            <button>Edit Profile</button>
                    </div>
                    </div>
                    <div className="Settings">
                        <button>Followers</button>
                        <button>Following</button>
                        <button>Fractals</button>
                        <button>Private Fractals</button>
                        <button>Public Fractals</button>
                    </div>
                    <div className="UserBio">
                        <p>Here is a bunch of random text</p>
                    </div>
                </div>
            </div>

            <div className = 'UserSelectedFractals'>
                <div className="postGallery">
                    <div className="postGallery1">{postsListEven}</div>
                    <div className="postGallery2">{postsListOdd}</div>
                </div>
            </div>
        </div>

    );
}

export default Account;