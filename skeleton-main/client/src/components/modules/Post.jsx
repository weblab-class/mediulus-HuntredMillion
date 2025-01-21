import React from "react";
import "../pages/Feed.css"; // Ensure the styles are applied

const Post = () => {
    return (
        <div className="Post">
            <p>This is the post</p>
            <div className="FractalImage"></div> {/* Placeholder for the image */}
            <p>username</p>
            <div>Account Logo</div>
            <p>caption</p>
            <div>Comment Link</div>
            <div>heart</div>
        </div>
    );
};

export default Post;
