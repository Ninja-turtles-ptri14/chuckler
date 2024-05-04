/* eslint-disable no-restricted-syntax */
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import SentMessages from "./SentMessages.jsx";
import TypeMessages from "./TypeMessage.jsx";
import socket from "../../utils/socket.js";

/*
Looks at the url parameters of the page and returns and object of the form:
{user: {userId}, receiver: {receiverId}}
*/
const getParamsFromUrl = () => {
  // TODO: replace this with a function that gets auth data from the server
  try {
    const output = {};

    const url = document.URL;
    const urlParams = url.split("?")[1];
    const paramsArray = urlParams.split("&");

    for (const element of paramsArray) {
      const keyValue = element.split("=");
      output[keyValue[0]] = keyValue[1];
    }
    return output;
  } catch (err) {
    console.error("Error getting params from url", err);
  }
};

const ChatContainer = () => {
  // specifies chatroom context - user ids of user who is sending messages and user who is recieving
  // Logic still has to be implmented to set values of sender and reciever from auth data
  const { user } = useContext(AuthContext);
  const token = user.token;
  const [chatData] = useState(getParamsFromUrl());
  const [messages, setMessages] = useState([]);

  console.log("usersData: ", chatData);
  // create connetion to wss to be used by all child props

  useEffect(() => {
    const getMessages = async () => {
      try {
        const userMessages = await fetch(
          `/api/match/messages?match_id=${chatData.match}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            Authorization: `Bearer ${token}`,
          }
        );
        const parsedUserMessages = await userMessages.json();
        console.log("userMessages", parsedUserMessages);
        setMessages(parsedUserMessages);
      } catch (error) {
        console.log("Error trying to fetch messages", error);
      }
    };

    // Make fetch request
    getMessages();
  }, []);

  return (
    <div className="test">
      <div className="messages-component">
        <SentMessages
          usersData={chatData}
          socket={socket}
          messages={messages}
        />
      </div>
      <div className="input-component">
        <TypeMessages usersData={chatData} socket={socket} />
      </div>
    </div>
  );
};

export default ChatContainer;
