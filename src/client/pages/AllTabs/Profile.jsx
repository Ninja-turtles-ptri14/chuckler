import React, { useState, useContext } from "react";
import '../../stylesheets/profile.css'
import userProfileIcon from '../../images/userProfile.png';
import { useNavigate, } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function Profile({ userData }) {
    const [profileImage, setProfileImage] = useState(userProfileIcon);
    
    // const form = document.getElementById('setImg');
    // const img = form.get('image');

    const { user } = useContext(AuthContext);
    const token = user.token;
    // const header = { headers: { Authorization: `Bearer ${token}` } };
    
    const selectImg = (e) => {
        const img = e.target.files;
        setProfileImage(img);
    }

    const changeProImg = async (e) => {
        // const newImg = new FormData();
        // newImg.append('image', profileImage);
        // console.log('this is new FormData: ', newImg);

        try {
            const res = await fetch('/api/user/picture', {
                method: 'POST',
                body: JSON.stringify({ image: profileImage }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (err) {
            console.error(`Could not set new profile image. Error: ${err}`);
        }
    };

    return (
        <div className="profile-container">
            <div className="pro-img">
                <img
                    src={profileImage}
                    alt="user-profile"
                    style={{ width: '370px' }}
                />
                <div>
                    {/* <form id="setImg">
                        <label htmlFor="image">Set new profile image</label>
                        <input type="file" accept="image/*" id="image" onChange={selectImg} />
                        <button type="submit" onClick={changeProImg}>Change image</button>
                    </form> */}
                    <label htmlFor="image">Change profile picture</label>
                    <input id="image" type="file" accept="image/*" onChange={selectImg} />
                    <button onClick={changeProImg}>Ok</button>
                </div>
            </div>
            <div className="info">
                <p>Username: {userData.username}</p>
                <p>User ID: {userData.id}</p> 
            </div>
            {/* <button onClick={() => navigate}}>Metrics</button> */} 
        </div>
    );
}