import React, { useState, useContext, useEffect } from "react";
import "../../stylesheets/profile.css";
import userProfileIcon from "../../images/userProfile.png";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null); // Initialize as null
  const [userData, setUserData] = useState({});

  const { user } = useContext(AuthContext);
  const token = user.token;

  useEffect(() => {
    const getProfile = async () => {
      try {
        const userData = await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${token}`,
        });
        const parsedUserData = await userData.json();
        setUserData(parsedUserData);
      } catch (err) {
        console.log("error fetching user profile");
      }
    };

    // Make fetch request
    getProfile();
  }, []);

  const selectImg = (e) => {
    const img = e.target.files[0]; // Get the first file from the input
    setProfileImage(img);
  };

  const changeProImg = async () => {
    if (!profileImage) return; // If no image selected, return

    const formData = new FormData();
    formData.append("image", profileImage);

    try {
      const res = await fetch("/api/user/picture", {
        method: "POST",
        body: formData, // Send FormData instead of JSON.stringify
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle response as needed
    } catch (err) {
      console.error(`Could not set new profile image. Error: ${err}`);
    }
  };

  return (
    <div className="profile-container">
      <div className="pro-img">
        <img
          src={
            userData.user_picture // Check if user_picture exists
              ? userData.user_picture // Use user_picture if available
              : profileImage // Otherwise, use the selected image if available
              ? URL.createObjectURL(profileImage) // Use the selected image
              : userProfileIcon // Use the default profile icon
          }
          alt="user-profile"
          style={{ width: "350px" }}
        />
        <div>
            <label htmlFor="image">Change profile picture:</label>
            <input id="image" type="file" accept="image/*" onChange={selectImg} />
            <button type="button" id="accept-img" onClick={changeProImg}>Accept Change</button>
        </div>
      </div>
      <div className="info">
        <p>Username: {userData.username}</p>
        <p>Bio: {userData.bio}</p>
      </div>
    </div>
  );
}
