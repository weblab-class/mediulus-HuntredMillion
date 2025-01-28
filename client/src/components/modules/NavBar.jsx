import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import "./NavBar.css"; 
import "../../utilities.css";
import { UserContext } from "../App";
import FractalFlow from '../imgs/FractalFlow.png'

const NavBar = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <nav>
      <div className="navigation">
      <ul>
        <li className="FractalFlow"><Link className = 'content'to = '/'> <img src = {FractalFlow}/></Link></li>
        <li className = 'linky' ><Link to="/">Feed</Link></li>
        <li className = 'linky'><Link to="/Account">Profile</Link></li>
      </ul>
      </div>
      <ul className = 'rightContainer'>
        <li  className='create'><Link to="/Create">Create New + </Link></li>
        <li>
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
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
