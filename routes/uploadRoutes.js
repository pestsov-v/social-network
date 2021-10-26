const express = require('express');
const User = require('../schemas/UserSchema');

const path = require('path')

const app = express();
const router = express.Router();

router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})

module.exports = router;