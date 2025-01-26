import React, { useState, useEffect, createContext } from "react";
import { Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";

import "../utilities.css";

import { socket } from "../client-socket";
import { get, post } from "../utilities";

import NavBar from "./modules/NavBar";

export const UserContext = createContext(null);

const App = () => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
        localStorage.setItem("userId", user._id); // Store userId in localStorage
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      localStorage.setItem("userId", user._id); // Store userId in localStorage
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    localStorage.removeItem("userId"); // Clear userId from localStorage
    post("/api/logout");
  };

  const authContextValue = {
    userId,
    handleLogin,
    handleLogout,
  };

  return (
    <UserContext.Provider value={authContextValue}>
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default App;
