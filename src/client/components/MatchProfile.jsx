import React from "react";
import { Link } from 'react-router-dom';
import userProfile from '../images/userProfile.png';

export default function MatchProfile({ name, status, matchId, userId, user_picture }) {
  return (
    <div className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-200 ${status === 'Online' ? 'bg-green-400' : ''}`} style={{ width: '400px' }}>
      <div className="flex items-center">
        <img src={user_picture || userProfile} alt="profile" className="w-12 h-12 rounded-full mr-4" />
        <div className="flex flex-col">
          <Link to={`/chat/?user=${userId}&match=${matchId}`} className="text-gray-800">
            <h3 className="text-lg">{name}</h3>
            <p className="text-sm">{status}</p>
          </Link>
        </div>
      </div>
      {status === 'Online' && <div className="w-4 h-4 rounded-full bg-green-600 mr-4"></div>}
    </div>
  );
}
