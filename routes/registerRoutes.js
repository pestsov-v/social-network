const express = require('express');
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false}))


router.get("/", (req, res, next) => {
    res.status(200).render("register.pug");
})

router.post("/", (req, res, next) => {
    
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password;

    const payload = req.body;
    

    if (firstName && lastName && username && email && password) {
        
    } else {
        payload.errorMessage = "Заполните все поля";
        res.status(200).render("register.pug", payload);
    }

    
})


module.exports = router;