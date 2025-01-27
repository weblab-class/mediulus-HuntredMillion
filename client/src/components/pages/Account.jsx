import './Account.css'
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx"
import { get } from "../../utilities";
import Post from '../modules/Post.jsx'

const Account = (props) => {
    const { userId } = useContext(UserContext);
    const [userName, setUserName] = useState('');

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
      const [privatePosts, setPrivatePosts] = useState([]);
      const [publicPosts, setPublicPosts] = useState([]);

      
      useEffect(() => {
        // Fetch all posts for the user
        get("/api/allPosts", { user: userName })
          .then((postObjs) => {
            if (postObjs && postObjs.length) {
              let reversedpostObjs = postObjs.reverse();
              setPosts(reversedpostObjs);
      
              // Separate private and public posts
              let privatePostObjs = reversedpostObjs.filter((post) => !post.is_public);
              let publicPostObjs = reversedpostObjs.filter((post) => post.is_public);
      
              setPrivatePosts(privatePostObjs);
              setPublicPosts(publicPostObjs);
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
      }, [userName]);

        let postsList = posts.map((postObj) => (
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

        let PrivatePostsList = privatePosts.map((postObj) => (
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

        let PublicPostsList = publicPosts.map((postObj) => (
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

    const [postType, setPostType] = useState('all')

    const PostDisplayAll = () => {
        setPostType('all');
    }

    const PostDisplayPublic = () => {
        setPostType('public');
    }

    const PostDisplayPrivate = () => {
        setPostType('private');
    }

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
                        <button onClick = {PostDisplayAll}>Fractals</button>
                        <button onClick = {PostDisplayPrivate}>Private Fractals</button>
                        <button onClick = {PostDisplayPublic}>Public Fractals</button>
                    </div>
                    <div className="UserBio">
                        <p>Here is a bunch of random text</p>
                    </div>
                </div>
            </div>
            <div className = 'UserSelectedFractals'>
            {postType === 'all' ? (
                postsList
            ) : postType === 'private' ? (
                PrivatePostsList
            ) : postType === 'public' ? (
                PublicPostsList
            ) : (
                null // Fallback for unmatched cases
            )}
            </div>
        </div>

    );
}

export default Account;