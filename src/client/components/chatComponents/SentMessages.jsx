import React, { useState, useEffect, useRef } from 'react';
import userProfile from '../../images/userProfile.png';
import { formatDistanceToNow } from 'date-fns';

const SentMessages = ({ usersData, socket, messages }) => {
  const messagesEndRef = useRef(null);
  const [user, receiver] = [usersData.user, usersData.otherUser];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => {
          const isUser = message.from_user_id === user;
          const timestamp = formatDistanceToNow(new Date(message.created_at), { addSuffix: true });
          return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`bg-gray-100 p-3 rounded-lg ${isUser ? 'bg-blue-300' : 'bg-white'}`}>
                <p className="text-gray-800">{message.message_content}</p>
                <p className="text-xs text-gray-400">{timestamp}</p>
              </div>
              {isUser && (
                <img src={userProfile} alt="profile" className="w-8 h-8 rounded-full ml-2" />
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
