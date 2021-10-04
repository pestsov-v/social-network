const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');

const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render("login.pug");
})

router.post("/", async (req, res, next) => {

    const payload = req.body;

    if (req.body.logUsername && req.body.logPassword) {
        const user = await User.findOne({ 
            $or: [
                {username: req.body.logUsername},
                {email: req.body.logUsername}
            ]
        }).catch((err) => {
            console.log(err);
            payload.errorMessage = "Что-то пошло не так...";
            res.status(200).render("login.pug", payload);
        });

        if (user != null) {
            const result = await bcrypt.compare(req.body.logPassword, user.password);

            if (result === true) {
                req.session.user = user;
                return res.redirect("/");
            } 
        }
        
        payload.errorMessage = "Некоректные данные";
        res.status(200).render("login.pug", payload);
    }

    payload.errorMessage = "Заполните все поля";
    res.status(200).render("login.pug", payload);

})

module.exports = router;