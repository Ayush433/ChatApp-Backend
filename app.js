const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const cors = require("cors");
const io = require("socket.io")(4040, {
  cors: {
    origin: "http://localhost:5173",
  },
});
dotenv.config();
const port = process.env.PORT || 9000;
const dbURI = process.env.DATABASE;

//Socket.io
let users = [];
io.on("connection", (socket) => {
  console.log("User-Connected", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUser", users);
    }
  });

  socket.on(
    "sendMessages",
    async ({ senderId, message, conversationId, receiverId }) => {
      const receiver = users.find((user) => user.userId);
      // const sender = users.find((user) => user.senderId);
      if (receiver) {
        io.to(receiver.socketId).to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
        });
      }
    }
  );
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUser", users);
  });
  //   io.emit("getUsers",socket.userId)
});

const app = express();
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the Job Portal API Ho ni haina rw !");
});

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server started at Port number ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(userRoutes);
app.use(messageRoutes);

app.use(express.urlencoded({ extended: false }));

// Additional routes and middleware can be defined here
