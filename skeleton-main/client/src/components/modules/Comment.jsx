import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import './Comment.css'

/**
 * 
 * @param {String} key
 * @param {String} creator_id
 * @param {String} fractal_id
 * @param {String} content
 */
const Comments = (props) => {
    return (
        <div className="CommentContainer">
            <p>{props.creator_id}</p>
            <PersonOutlineIcon/>
            <p>{props.content}</p>
        </div>
    );
}

export default Comments;