import React, { useState } from "react";
import "./Feed.css";
import Post from '../modules/Post.jsx';

const Feed = () => {
    const [showCustomDisplay, setShowCustomDisplay] = useState(false);

    const toggleCustomDisplay = () => {
        setShowCustomDisplay(!showCustomDisplay);
    };

    const hideCustomDisplay = () => {
        setShowCustomDisplay(false);
    };

    return (
        <>
            <div className="Buttons">
                <button 
                    className="CustomFeed" 
                    onClick={toggleCustomDisplay}
                >
                    Customize Feed
                </button>

                {/* Add dynamic class based on showCustomDisplay */}
                <div 
                    className={`CustomDisplay ${showCustomDisplay ? "visible" : ""}`}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={hideCustomDisplay}
                        style={{ cursor: "pointer" }}
                    >
                        <g id="Minus circle">
                            <path
                                id="Icon"
                                d="M16 24H32M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z"
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                    <button className="DisplayButton">
                        <p onClick={hideCustomDisplay}>Trending</p>
                        <p onClick={hideCustomDisplay}>Following</p>
                    </button>
                </div>
            </div>
            <Post/>
            <Post/>
        </>
    );
};

export default Feed;
