const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema')

const app = express()
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false}))


router.get("/", (req, res, next) => {
    res.status(200).render("register.pug");
})

router.post("/", async (req, res, next) => {
    
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;
    

    if (firstName && lastName && username && email && password) {
        const user = await User.findOne({ 
            $or: [
                {username: username},
                {email: email}
            ]
        }).catch((err) => {
            console.log(err);
            payload.errorMessage = "Что-то пошло не так...";
            res.status(200).render("register.pug", payload);
        });

        if (user == null) {
            let data = req.body;
            
            data.password = await bcrypt.hash(password, 10)

            User.create(data).then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })

        } else {
            if (email == user.email) {
                payload.errorMessage = "Такая почта уже используется";
            } else {
                payload.errorMessage = "Такой username уже используется";
            }
            res.status(200).render("register.pug", payload);
        }
        
    } else {
            payload.errorMessage = "Заполните все поля";
            res.status(200).render("register.pug", payload);
    }

    
})


module.exports = router;