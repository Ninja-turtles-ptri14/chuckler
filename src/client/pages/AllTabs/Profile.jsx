import React from "react";
import '../../stylesheets/profile.css'
import userProfileIcon from '../../images/userProfile.png';
import {useNavigate} from 'react-router-dom';

export default function Profile({ userData }) {
  const changeProPic = async (e) => {
    const res = await fetch('/api/user/profile')
  }

  return (
    <div className="profile-container">
      <div className="propic">
        <img src={userProfileIcon} alt="user-profile" style={{ width: '370px' }} />
        <button onClick={changeProPic}      
      </div>
      <div className="info">
        <p>Username: {userData.username}</p>
        <p>User ID: {userData.id}</p> 
      </div>
          {/* <button onClick={() => navigate}}>Metrics</button> */} 
    </div>
  );
}