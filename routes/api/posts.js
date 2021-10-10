const express = require('express');
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema')
const Post = require('../../schemas/PostSchema')
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    const results = await getPosts({});
    res.status(200).send(results)
})

router.get("/:id", async (req, res, next) => {

    const postId = req.params.id;

    let results = await getPosts({_id: postId});
    results = results[0];
    res.status(200).send(results);
})

router.post("/", async (req, res, next) => {

    if (req.body.replyTo) {
        console.log(req.body.replyTo);
        return res.sendStatus(400);
    }

    if (!req.body.content) {
        console.log("Нету никакого содержимого в req.body.content")
        return res.sendStatus(400);
    }

    let postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
    .then(async newPost => {
        newPost = await User.populate(newPost, {path: "postedBy"})


        res.status(201).send(newPost)
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

router.put("/:id/like", async (req, res, next) => {
    
    const postId = req.params.id;
    const userId = req.session.user._id;

    const isLiked = req.session.user.likes && req.session.user.likes.includes(postId)

    const option = isLiked ? "$pull" : "$addToSet"
    
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.status(400);
    }) 

    const post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.status(400);
    })

    res.status(200).send(post)

})

router.post("/:id/retweet", async (req, res, next) => {
    
    const postId = req.params.id;
    const userId = req.session.user._id;

    const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(error => {
        console.log(error);
        res.status(400);
    })

    const option = deletedPost != null ? "$pull" : "$addToSet";

    let repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            res.status(400);
        })
    }

    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id }}, {new: true})
    .catch(err => {
        console.log(err);
        res.status(400);
    }) 

    const post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.status(400);
    })

    res.status(200).send(post)

})


async function getPosts(filter) {
    const results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .sort({"createdAt": -1})
    .catch(err => console.log(err))

    return await User.populate(results, {path: "retweetData.postedBy"}) 
}


module.exports = router;