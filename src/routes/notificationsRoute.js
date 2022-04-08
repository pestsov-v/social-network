const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  res.status(200).render("notificationsPage", {
    pageTitle: "Уведомления",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

module.exports = router;
