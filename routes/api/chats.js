const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const Chat = require('../../schemas/chatSchema')

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if (!req.body.users) {
        console.log("Параметры пользователя не были отправлены в теле запроса");
        return res.sendStatus(400);
    }

    const users = JSON.parse(req.body.users)

    if (users.length == 0) {
        console.log("Массив пользователей пуст");
        return res.sendStatus(400);
    }

    users.push(req.session.user);
    const chatData = {
        users: users,
        isGroupChat: true
    };

    Chat.create(chatData)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})



module.exports = router;