import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Optional: Add a CSS file for styling

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Feed</Link></li>
        <li><Link to="/account">Account</Link></li>
        <li><Link to="/create">Create</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
