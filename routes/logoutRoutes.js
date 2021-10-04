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
    
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login")
        })
    }
})

module.exports = router;