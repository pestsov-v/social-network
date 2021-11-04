const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const Message = require('../../schemas/MessageSchema')
const Chat = require('../../schemas/ChatSchema')
const User = require('../../schemas/UserSchema')

router.post("/", async (req, res, next) => {
    if(!req.body.content || !req.body.chatId) {
        console.log("Ошибочная информация пришла вместо с запросом");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId
    };

    Message.create(newMessage)
    .then(async message => {
        message = await message.populate("sender");
        message = await message.populate("chat");
        message = await User.populate(message, { path: "chat.users" })

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
        .catch(error => console.log(error))

        res.status(201).send(message);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

module.exports = router;