const express = require('express');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const User = require('../../schemas/UserSchema')
const router = express.Router();

const upload = multer({ dest: "uploads/"})

router.get("/", async (req, res, next) => {
    let searchObj = req.query;

    if (req.query.search !== undefined) {
        searchObj = {
            $or: [
                {firstName: { $regex: req.query.search, $options: "i" }},
                {lastName: { $regex: req.query.search, $options: "i" }},
                {username: { $regex: req.query.search, $options: "i" }}
            ]
        }
    }

    User.find(searchObj)
    .then(results => res.status(200).send(results))
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
});

router.put("/:userId/follow", async (req, res, next) => {

    let userId = req.params.userId;
    let user = await User.findById(userId);

    if (user == null) return res.sendStatus(404);

    const isFollowing = user.followers && user.followers.includes(req.session.user._id);

    const option = isFollowing ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    
    User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id }})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    }) 

    res.status(200).send(req.session.user)
});

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
});

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
});

router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
    if (!req.file) {
        console.log("Отсутствует файл, который должен прийти в запросе от ajax")
        return res.sendStatus(400)
    } 

    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if (error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, {profilePic: filePath}, { new:true });
        res.sendStatus(204);
    })
});

router.post("/coverPhoto", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file) {
        console.log("Отсутствует файл, который должен прийти в запросе от ajax.");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { coverPhoto: filePath }, { new: true });
        res.sendStatus(204);
    })

});


module.exports = router;