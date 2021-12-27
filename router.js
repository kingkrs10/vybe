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
const shopsRouter = require("./src/shops");
const categoriesRouter = require("./src/categories");
const shopCollectionsRouter = require("./src/shopCollections");
const productsRouter = require("./src/products");

router.use("/", utilRouter);
router.use("/users", userRouter);
router.use("/offers", offersRouter);
router.use("/userInvites", userInvitesRouter);
router.use("/notifications", notificationsRouter);
router.use("/countryCurrency", countryCurrencyRouter);
router.use("/currency", currencyRouter);
router.use("/categories", categoriesRouter);
router.use("/shops", shopsRouter);
router.use("/shopCollections", shopCollectionsRouter);
router.use("/products", productsRouter);

router.use("/chats", chatsRouter);
router.use("/messages", messagesRouter);
router.use("/stripe", stripeRouter);

module.exports = router;