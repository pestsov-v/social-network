const express = require('express');
const User = require('../schemas/UserSchema');

const app = express();
const router = express.Router();

router.get("/", (req, res, next) => {

    res.status(200).render("inboxPage.pug", {
        pageTitle: "Входящие сообщения",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    });
})

router.get("/new", (req, res, next) => {

    res.status(200).render("newMessage.pug", {
        pageTitle: "Новое сообщение",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    });
})



module.exports = router;