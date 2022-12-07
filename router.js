const express = require("express");
const router = express.Router();
const userRouter = require("./src/users");
const utilRouter = require("./src/util");
const eventsRouter = require("./src/events");
const userInvitesRouter = require("./src/userInvites");
const notificationsRouter = require("./src/notifications");
const stripeRouter = require("./src/stripe");
const countryCurrencyRouter = require("./src/countryCurrency");
const currencyRouter = require("./src/currency");
const paymentMethodsRouter = require("./src/paymentMethods");
const statusRouter = require("./src/status");
const addressesRouter = require("./src/addresses");

router.use("/", utilRouter);
router.use("/users", userRouter);
router.use("/userInvites", userInvitesRouter);
router.use("/events", eventsRouter);
router.use("/countryCurrency", countryCurrencyRouter);
router.use("/currency", currencyRouter);
router.use("/paymentMethods", paymentMethodsRouter);
router.use("/status", statusRouter);
router.use("/addresses", addressesRouter);
router.use("/notifications", notificationsRouter);
router.use("/stripe", stripeRouter);

module.exports = router;
