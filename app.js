const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const middleware = require("./src/middleware");

const config = require("./config");

const loginRoute = require("./src/routes/loginRoutes");
const registerRoute = require("./src/routes/registerRoutes");
const logoutRoute = require("./src/routes/logoutRoutes");
const postRoute = require("./src/routes/postRoutes");
const profileRoute = require("./src/routes/profileRoutes");
const uploadRoute = require("./src/routes/uploadRoutes");
const searchRoute = require("./src/routes/searchRoutes");
const messagesRoute = require("./src/routes/messagesRoutes");
const notificationsRoute = require("./src/routes/notificationsRoute");

const usersApiRoute = require("./src/routes/api/users");
const postsApiRoute = require("./src/routes/api/posts");
const chatsApiRoute = require("./src/routes/api/chats");
const messagesApiRoute = require("./src/routes/api/messages");
const notificationsApiRoute = require("./src/routes/api/notifications");

const app = express();
const PORT = 3003;
const serverFunction = () => console.log(`Server listening on port ${PORT}`);

const server = app.listen(PORT, serverFunction);
const io = require("socket.io")(server, { pingTimeout: 60000 });

app.set("view engine", "pug");
app.set("views", "./src/views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./src/public")));

app.use(
  session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false,
  })
);

app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);
app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: "Главная",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render("home.pug", payload);
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join room", (room) => socket.join(room));
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("notification received", (room) =>
    socket.in(room).emit("notification received")
  );

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users не определён");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
});
