import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; 
import CreateTag from '../imgs/CreateTag.png'
const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/Account">Account</Link></li>
        <li  className='create'><Link to="/Create"> <img src={CreateTag}/></Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
