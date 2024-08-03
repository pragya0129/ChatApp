const path = require("path");
const express = require("express");

const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 4444;
const app = express();
const httpServer = createServer(app);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let userMap = {};

const io = new Server(httpServer);
io.on("connection", (socket) => {
  //creates the pipeline
  socket.emit("Welcome", "Welcome to our app");

  socket.on("saveuser", ({ username }) => {
    console.log(username, socket.id);
    userMap[socket.id] = username;
    let activeUser = [];
    for (let i in userMap) {
      activeUser.push(userMap[i]);
    }
    // socket.broadcast.emit("joinedChat", {
    //   username,
    //   activeUser,
    // });

    io.emit("joinedChat", {
      username,
      activeUser,
    });
  });

  socket.on("thankyou", (msg, cb) => {
    console.log(msg);
    cb({ status: "ok" });
  });

  socket.on("disconnect", () => {
    let socketId = socket.id;
    let username = userMap[socket.id];

    if (username) {
      delete userMap[socketId];
      let activeUser = [];
      for (let i in userMap) {
        activeUser.push(userMap[i]);
      }
      socket.broadcast.emit("disconnectedUser", {
        username,
        activeUser,
      });
    }
  });

  socket.on("chat", (msg, cb) => {
    console.log(msg);
    cb({ status: "Success" });
    io.emit("msg", { text: msg, senderName: userMap[socket.id] }); // socket refers to the pipeline.. io refers to all the sockets connected to the server
  });
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

httpServer.listen(port, () => {
  console.log(`http:localhost:` + port);
});
