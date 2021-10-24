const express = require('express');
const User = require('../schemas/UserSchema');

const app = express();
const router = express.Router();

router.get("/", (req, res, next) => {

    const payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }

    res.status(200).render("profilePage.pug", payload);
})

router.get("/:username", async (req, res, next) => {

    const payload = await getPayload(req.params.username, req.session.user);
    res.status(200).render("profilePage.pug", payload);
})

async function getPayload(username, userLoggedIn) {
    let user = await User.findOne({username: username})
    
    if (user == null) {

        user = await User.findById(username);

        if (user == null) {
            return {
                pageTitle: "Пользователь не найден",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn)
            }
        }
    }

    return {
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }
}

module.exports = router;