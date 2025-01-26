import './Account.css'
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App.jsx"
import { get } from "../../utilities";

const Account = (props) => {
    const [posts, setPosts] = useState([]);
    const { userId } = useContext(UserContext);
    const [userName, setUserName] = useState('');

    useEffect (() => {
        console.log('here 1')
        if (userId) {
          get("/api/UserName", { user_id: userId })
            .then((user) => {
              console.log("Here is the userName:", user);
              setUserName(user.name); // Update state with the username
            })
            .catch((err) => {
              console.error("Error fetching username:", err);
            });
        }
      }, [userId])

    /* Fetch posts when the component mounts */
    // useEffect(() => {
    //     document.title = "Post Feed";
    //     get("/api/Usereposts")
    //     .then((postObjs) => {
    //         console.log('PostObjs:', postObjs)
    //         if (postObjs && postObjs.length) {
    //         let reversedpostObjs = postObjs.reverse();
    //         setPosts(reversedpostObjs);
    //         } else {
    //         setPosts([]);
    //         }
    //     })
    //     .catch((err) => {
    //         console.error("Error fetching posts:", err);
    //         setPosts([]);
    //     });
    // }, []);

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
                <p>These are the fractals</p>
            </div>
        </div>

    );
}

export default Account;