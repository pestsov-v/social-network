const express = require('express');
const path = require('path')
const middleware = require('./middleware');
const loginRoute = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes')

const app = express();
const PORT = 3003;
const serverFunction = () => console.log(`Server listening on port ${PORT}`);

const server = app.listen(PORT, serverFunction);

app.set("view engine", "pug");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRoute)
app.use("/register", registerRoutes)

app.get("/", middleware.requireLogin, (req, res, next) => {

    const payload = {
        pageTitle: "Home"
    }

    res.status(200).render("home.pug", payload);
})