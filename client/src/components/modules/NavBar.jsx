import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "./NavBar.css"; 
import CreateTag from '../imgs/CreateTag.png'
import "../../utilities.css";
import { UserContext } from "../App";

const NavBar = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <nav>
      <div className="login">
      {userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Log Out
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )}
      </div>
      <div className="navigation">
      <ul>
        <li className = 'linky' ><Link to="/">Feed</Link></li>
        <li className = 'linky'><Link to="/Account">Account</Link></li>
        <li  className='create'><Link to="/Create"> <img src={CreateTag}/></Link></li>
      </ul>
      </div>
    </nav>
  );
};

export default NavBar;
