const express = require('express');
const User = require('../schemas/UserSchema');

const app = express();
const router = express.Router();

router.get("/", (req, res, next) => {
    const payload = createPayload(req.session.user)
    res.status(200).render("searchPage.pug", payload);
})

router.get("/:selectedTab", (req, res, next) => {

    const payload = createPayload(req.session.user)
    payload.selectedTab = req.params.selectedTab
    res.status(200).render("searchPage.pug", payload);
})

function createPayload(userLoggedIn) {
    return {
        pageTitle: "Поиск",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }
}

module.exports = router;