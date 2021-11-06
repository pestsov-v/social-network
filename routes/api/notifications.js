const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const Message = require('../../schemas/MessageSchema')
const Chat = require('../../schemas/ChatSchema')
const User = require('../../schemas/UserSchema')
const Notification = require('../../schemas/NotificationSchema')

router.get("/", async (req, res, next) => {
    Notification.find({ userTo: req.session.user._id, notificationType: { $ne: "newMessage" } })
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: - 1})
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


module.exports = router;