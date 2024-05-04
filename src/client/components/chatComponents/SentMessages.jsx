import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

const SentMessages = ({ usersData, socket, messages }) => {
  const messagesEndRef = useRef(null);
  const [user, receiver] = [usersData.user, usersData.otherUser];
  const [userPic, setUserPic] = useState("");
  const [otherUserPic, setOtherUserPic] = useState("");

  useEffect(() => {
    const getPictures = async () => {
      try {
        const userPictureRes = await fetch(`/api/user/picture?userId=${user}`);
        const otherUserPictureRes = await fetch(
          `/api/user/picture?userId=${receiver}`
        );
        const userPicture = await userPictureRes.json();
        const otherUserPicture = await otherUserPictureRes.json();

        setOtherUserPic(otherUserPicture);
        setUserPic(userPicture);
      } catch (err) {
        console.log("Error fetching profile pictures");
      }
    };

    getPictures();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => {
          const isUser = message.from_user_id === user;
          const timestamp = formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
          });
          return (
            <div
              key={index}
              className={`flex mb-2 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <img
                  src={otherUserPic}
                  alt="profile"
                  className="w-8 h-8 rounded-full mr-2 mt-3.5"
                />
              )}
              <div>
                <p className="text-xs font-bold text-gray-500">
                  {!isUser ? receiver.username : user.username}
                </p>
                <div
                  className={`bg-gray-100 p-3 rounded-lg ${
                    isUser ? "bg-blue-300" : "bg-white"
                  }`}
                >
                  <p className="text-gray-800">{message.message_content}</p>
                  <p className="text-xs text-gray-400">{timestamp}</p>
                </div>
              </div>
              {isUser && (
                <img
                  src={userPic}
                  alt="profile"
                  className="w-8 h-8 rounded-full ml-2 mt-3.5"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

export default SentMessages;
