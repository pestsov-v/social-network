const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session')
const middleware = require('./middleware');



const mongoose = require('./database')
const config = require('./config')

const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes')
const postRoute = require('./routes/postRoutes')
const profileRoute = require('./routes/profileRoutes')
const uploadRoute = require('./routes/uploadRoutes')
const searchRoute = require('./routes/searchRoutes')
const messagesRoute = require('./routes/messagesRoutes')
const notificationsRoute = require('./routes/notificationsRoute')

const usersApiRoute = require('./routes/api/users')
const postsApiRoute = require('./routes/api/posts')
const chatsApiRoute = require('./routes/api/chats')
const messagesApiRoute = require('./routes/api/messages')
const notificationsApiRoute = require('./routes/api/notifications')



const app = express();
const PORT = 3003;
const serverFunction = () => console.log(`Server listening on port ${PORT}`);
 
const server = app.listen(PORT, serverFunction);
const io = require('socket.io')(server, { pingTimeout: 60000 });



app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false
}));


app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/register", registerRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute)
app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute)



app.get("/", middleware.requireLogin, (req, res, next) => {

    const payload = {
        pageTitle: "Главная",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("home.pug", payload);
})

io.on("connection", (socket) => {
    socket.on("setup", userData => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join room" , room => socket.join(room))
    socket.on("typing", room => socket.in(room).emit("typing"))
    socket.on("stop typing", room => socket.in(room).emit("stop typing"))

    socket.on("new message", newMessage => {
        const chat = newMessage.chat;

        if (!chat.users) return console.log("Chat.users не определён");

        chat.users.forEach(user => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage)
        })
    })
})