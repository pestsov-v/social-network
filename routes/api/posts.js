const express = require('express');

const User = require('../../schemas/UserSchema')
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
})

router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        console.log("Нету никакого содержимого в req.body.content")
        return res.status(400);
    }

    res.status(200).send("Сработало!")
})

module.exports = router;