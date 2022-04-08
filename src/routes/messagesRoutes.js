const express = require("express");
const Chat = require("../schemas/chatSchema");
const User = require("../schemas/UserSchema");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).render("inboxPage.pug", {
    pageTitle: "Входящие сообщения",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

router.get("/new", (req, res, next) => {
  res.status(200).render("newMessage.pug", {
    pageTitle: "Новое сообщение",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  });
});

router.get("/:chatId", async (req, res, next) => {
  const userId = req.session.user._id;
  const chatId = req.params.chatId;
  const isValidId = mongoose.isValidObjectId(chatId);

  let chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate("users");

  const payload = {
    pageTitle: "Чат",
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    chat: chat,
  };

  if (!isValidId) {
    payload.errorMessage =
      "У Вас нет доступа к данному чату или данный чат ещё не был создан";
    return res.status(200).render("chatPage.pug", payload);
  }

  if (chat == null) {
    const userFound = await User.findById(chatId);

    if (userFound != null) {
      chat = await getChatByUserId(userFound._id, userId);
    }
  }

  if (chat == null) {
    payload.errorMessage =
      "У Вас нет доступа к данному чату или данный чат ещё не был создан";
  } else {
    payload.chat = chat;
  }

  res.status(200).render("chatPage.pug", payload);
});

function getChatByUserId(userLoggedInId, otherUserId) {
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) } },
          { $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
        ],
      },
    },
    {
      $setOnInsert: {
        users: [userLoggedInId, otherUserId],
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).populate("users");
}

module.exports = router;
