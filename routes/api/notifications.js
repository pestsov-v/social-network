const express = require('express');
const app = express();
const router = express.Router();
const Notification = require('../../schemas/NotificationSchema')

router.get("/", async (req, res, next) => {
    const searchObj = { userTo: req.session.user._id, notificationType: { $ne: "newMessage" } };

    if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        searchObj.opened = false;
    }
    
    Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:id/markAsOpened", async (req, res, next) => {
    Notification.findByIdAndUpdate(req.params.id, {opened: true})
    .then(() => res.sendStatus(200))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/markAsOpened", async (req, res, next) => {
    Notification.updateMany({userTo: req.session.user._id}, {opened: true})
    .then(() => res.sendStatus(200))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


module.exports = router;