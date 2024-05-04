const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const configureSocket = require("./sockets/socket");
require("dotenv").config();

// Routers
const jokeRouter = require("./routes/jokeRouter");
const userRouter = require("./routes/userRouter");
const matchRouter = require("./routes/matchRouter");

const PORT = process.env.PORT;

// create the express server
const app = express();
const io = configureSocket(app);

// parse incoming json
app.use(express.json());
app.use(cookieParser());
// serve static files from the build file
app.use(express.static("build"));

// routers
app.use("/api/user", userRouter);

app.use("/api/joke", jokeRouter);

app.use("/api/match", matchRouter);

// catch-all route handler
app.use((req, res) => {
  res.status(404).send("!!Page not found!!");
});

// global error handler
app.use((err, req, res) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// set up the server to handle websocket connections
// const wss = new WebSocket.WebSocketServer({ server });

// wss.on("connection", (socket, request) => {
//   websocketRouter(socket, request, wss);
// });

// set up the server to listen for http requests
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
  });
}
module.exports = app;
