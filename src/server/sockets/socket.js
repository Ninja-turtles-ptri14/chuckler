const { Server } = require("socket.io");
const http = require("http");
const chatModel = require("../models/chatModel");

const configureSocket = (app) => {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("openMatch", async (match_id) => {
      console.log("user entered into match ", match_id);
      socket.join(match_id);

      socket.on("message", (match_id, user_id, msg) => {
        socket.broadcast.emit("message", match_id);
        chatModel.sendMessage(match_id, msg, user_id);
      });

      socket.on("receiveMessage", (socket) => {});
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

module.exports = configureSocket;
