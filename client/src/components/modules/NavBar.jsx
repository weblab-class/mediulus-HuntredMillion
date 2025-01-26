import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "./NavBar.css"; 
import CreateTag from '../imgs/CreateTag.png'
import "../../utilities.css";
import { UserContext } from "../App";

const NavBar = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  console.log('here is the userId: ', userId)
  return (
    <nav>

      <ul>
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/Account">Account</Link></li>
        <li  className='create'><Link to="/Create"> <img src={CreateTag}/></Link></li>
      </ul>
      {userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )}
    </nav>
  );
};

export default NavBar;
