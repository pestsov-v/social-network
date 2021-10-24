const express = require('express');
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema');
const app = express();
const router = express.Router();

router.put("/:userId/follow", async (req, res, next) => {

    let userId = req.params.userId;
    let user = await User.findById(userId);

    if (user == null) return res.sendStatus(404);

    const isFollowing = user.followers && user.followers.includes(req.session.user._id);

    const option = isFollowing ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.status(400);
    })
    
    User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id }})
    .catch(err => {
        console.log(err);
        res.status(400);
    }) 

    res.status(200).send(req.session.user)
})

router.get("/:userId/following", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("following")
    .then(results => {
        res.status(200).send(results)
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/:userId/followers", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("followers")
    .then(results => {
        res.status(200).send(results)
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


module.exports = router;