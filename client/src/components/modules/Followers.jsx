import React, { useState, useEffect, useContext } from "react";
import UserName from './UserName.jsx'
import './Follow.css'
import { UserContext } from "../App.jsx"
import { get } from "../../utilities";

const Followers = () => {
    const { userId } = useContext(UserContext);
    console.log('found userID', userId);
    const [followersList, setFollowersList] = useState([]);

    useEffect(() => {
      if (!userId) {
          console.log('userId is not available yet');
          return;
      }
      get('/api/findFollowers', {user:userId})
          .then((followers) => {
              if (followers) {
                  setFollowersList(followers);
              } else {
                  console.log('No following data received');
                  setFollowersList([]);
              }
          })
          .catch((error) => {
              console.error('Error fetching following list:', error);
              setFollowersList([]); // Handle errors
          });
  }, [userId]);

  const FollowerNames = followersList.map((name) => (
    console.log('name:', name), // This will still log but won't affect the return
    <UserName user_name={name} />
  ));

    console.log(FollowerNames)
    return (
      <div className="Follow">
        <div className="names">
          {FollowerNames}
        </div>
      </div>
    );
  };

  export default Followers;