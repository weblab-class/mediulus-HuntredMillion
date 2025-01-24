import './Account.css'

const Account = (props) => {
    return (
        <div className='Account'>
            <div className="Profile">
                <div className="TopSection">
                    <div className='PictureContainer'>
                        <div className="ProfilePic">
                            <img src = '../imgs/osu.jpeg' alt = "user profile pic"/>
                        </div>
                        <div className = 'UserNameAndEdit'>
                            <p>Username</p>
                            <button>Edit Profile</button>
                    </div>
                    </div>
                    <div className="Settings">
                        <button>Followers</button>
                        <button>Following</button>
                        <button>Fractals</button>
                        <button>Private Fractals</button>
                        <button>Public Fractals</button>
                    </div>
                    <div className="UserBio">
                        <p>Here is a bunch of random text</p>
                    </div>
                </div>
            </div>

            <div className = 'UserSelectedFractals'>
                <p>These are the fractals</p>
            </div>
        </div>

    );
}

export default Account;