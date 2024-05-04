import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import "../../stylesheets/matches.css";
import MatchProfile from "../../components/MatchProfile.jsx";

export default function Matches({ userData }) {
  const { user } = useContext(AuthContext);
  //   const [userData, setUserData] = useState(user); // Grabbing from auth context
  const [matches, setMatches] = useState([]);

  const token = user.token;

  useEffect(() => {
    const getMatches = async () => {
      try {
        const userMatches = await fetch(`/api/user/matches`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          Authorization: `Bearer ${token}`,
        });
        const parsedUserMatches = await userMatches.json();
        setMatches(parsedUserMatches);
      } catch (error) {
        console.log("Error trying to fetch matches", error);
      }
    };

    // Make fetch request
    getMatches();
  }, []);

  console.log("USER MATCHES", matches);

  let renderMatches = [];
  if (Array.isArray(matches)) {
    matches.forEach((match, i) => {
      const { user, other_user } = match;
      renderMatches.push(
        <MatchProfile
          key={i}
          name={other_user.username}
          matchId={match.match_id}
          userId={user.id}
          otherUserId={other_user.id}
          status={other_user.is_online ? "Online" : "Offline"}
          userPicture={other_user.user_picture}
        />
      );
    });
  } else {
    renderMatches = matches;
  }

  return <div id="matches">{renderMatches}</div>;
}
