import React from "react";
import Comment from './Comment'
import "../pages/Feed.css"; // Ensure the styles are applied
import "./Post.css"
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

/** 
*
* @param {string} key    
* @param {string} post_id id of the post itself
* @param {string} creator_id id of the user who created the post
* @param {string} fractal_id
* @param {Array} likes list of users who liked the post
* @param {string} userId the current user
* @param {string} description the description
*/

const Post = (props) => {
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [seeComments, setSeeComments] = useState(false);

/**Gets the comments from the server */
    useEffect(() => {
        get("/api/comment", { fractal_id: props.fractal_id }).then((comments) => {
          setComments(comments);
        });
    }, []);

/** These are the dynamic functions*/
    const toggleLiked = () => {
        setLiked(!liked);
    };

    const toggleComments = () => {
        setSeeComments(!seeComments)
    };

/** Currently, the "comments" are just 
 * MongoDB comment objects so we need to make them
 * visible on the screen by making them components*/

    let commentsList = null;
    const hasComments = comments.length !== 0;
    if (hasComments) {
    commentsList = comments.map((commentObj) => (
      <Comment
        key={`Card_${commentObj._id}`}
        creator_id = {commentObj.creator_id}
        fractal_id = {commentObj.fractal_id}
        content = {commentObj.content}
      />
    ));
    } else {
        commentList = <div>No Comments!</div>;
    }

/**This is where the actual code starts */
    return (
        <div className="Card">

            /** This is what is on the screen as a normal post*/
            <div className = 'PostContainer'>
                <div className = 'FractalContainer'>
                    <img className = 'FractalImage'/>
                </div>
                <div className = 'ContentContainer'>
                    <p>{props.creator_id}</p>
                    <p>{props.description}</p>
                    
                    <div className="LikeAndComment">
                        <ChatBubbleOutlineIcon className = 'CommentButton' onClick = {toggleComments}/>
                        <IconButton className = 'LikedButton' onClick={toggleLiked} >
                            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <p>{likes.length}</p>
                    </div>
                </div>

                /**This is what is on the screen when the user is 
                looking at the comments on a post */
                <div className="CommentsContainer">
                    <div className="PostCaption">
                        <p>{props.creator_id}</p>
                        <p>{props.descriptions}</p>
                        <button onClick = {toggleComments}>Exit</button>
                    </div>
                    <div className = 'CommentSection'>
                        {commentList}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
