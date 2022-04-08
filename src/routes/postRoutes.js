const express = require("express");
const router = express.Router();

router.get("/:id", (req, res, next) => {
  const payload = {
    pageTitle: "Комментарии",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    postId: req.params.id,
  };

  res.status(200).render("postPage.pug", payload);
});

module.exports = router;
