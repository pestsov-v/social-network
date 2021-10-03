const express = require('express');

const app = express();
const PORT = 3003;
const serverFunction = () => console.log(`Server listening on port ${PORT}`)

const server = app.listen(PORT, serverFunction);

app.set("view engine", "pug")
app.set("views", "views")

app.get("/", (req, res, next) => {

    const payload = {
        pageTitle: "Home"
    }

    res.status(200).render("home.pug", payload);
})