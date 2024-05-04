import io from "socket.io-client";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const socket = io("localhost:3000");

export default socket;
