const { Server } = require("socket.io");
const http = require("http");
const chatModel = require("../models/chatModel");

const configureSocket = (app) => {
  const httpServer = http.createServer(app);
  const jwt = require("jsonwebtoken");
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("No JWT token");
    console.log("VERIFYING SOCKET REQUEST");
    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  });

  io.on("connection", (socket) => {
    console.log("A user connected: ", socket.user);

    socket.on("openMatch", async (match_id) => {
      console.log("user entered into match ", match_id);
      socket.join(match_id);
      socket.to(match_id).emit("user joined", socket.id);
    });

    socket.on("message", (match_id, user_id, msg) => {
      socket.broadcast.emit("message", match_id);
      chatModel.sendMessage(match_id, msg, user_id);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

module.exports = configureSocket;
