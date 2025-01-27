import React, { useState, useEffect, useContext } from "react";
import UserName from './UserName.jsx'
import './Follow.css'
import { UserContext } from "../App.jsx"
import { get } from "../../utilities";

const Following = () => {
    const { userId } = useContext(UserContext);
    console.log('found userID', userId);
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

  const FollowingNames = followingList.map((name) => (
    console.log('name:', name), // This will still log but won't affect the return
    <UserName user_name={name} />
  ));
    console.log('following List', FollowingNames);

    console.log(FollowingNames)
    return (
      <div className="Follow">
        <div className="names">
          {FollowingNames}
        </div>
      </div>
    );
  };

  export default Following;
  