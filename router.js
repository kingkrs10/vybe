const express = require("express");
const router = express.Router();
const userRouter = require("./src/users");
const utilRouter = require("./src/util");
const offersRouter = require("./src/offers");
const userInvitesRouter = require("./src/userInvites");
const notificationsRouter = require("./src/notifications");
const chatsRouter = require("./src/chats");
const messagesRouter = require("./src/messages");
const stripeRouter = require("./src/stripe");
const countryCurrencyRouter = require("./src/countryCurrency");
const currencyRouter = require("./src/currency");

router.use("/", utilRouter);
router.use("/users", userRouter);
router.use("/offers", offersRouter);
router.use("/userInvites", userInvitesRouter);
router.use("/notifications", notificationsRouter);
router.use("/chats", chatsRouter);
router.use("/messages", messagesRouter);
router.use("/stripe", stripeRouter);
router.use("/countryCurrency", countryCurrencyRouter);
router.use("/currency", currencyRouter);

module.exports = router;