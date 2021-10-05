const express = require('express');
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema')
const app = express();
const router = express.Router();



app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
})

router.post("/", async (req, res, next) => {

    if (!req.body.content) {
        console.log("Нету никакого содержимого в req.body.content")
        return res.sendStatus(400);
    }

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    await Post.create(postData)
    .then(async newPost => {
        newPost = await User.populate(newPost, {path: "postedBy"})


        res.status(201).send(newPost)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

module.exports = router;