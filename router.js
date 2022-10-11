const express = require("express");
const router = express.Router();
const userRouter = require("./src/users");
const utilRouter = require("./src/util");
const loansRouter = require("./src/loans");
const userInvitesRouter = require("./src/userInvites");
const notificationsRouter = require("./src/notifications");
const stripeRouter = require("./src/stripe");
const countryCurrencyRouter = require("./src/countryCurrency");
const currencyRouter = require("./src/currency");
const paymentMethodsRouter = require("./src/paymentMethods");
const statusRouter = require("./src/status");
const shippingAddressesRouter = require("./src/shippingAddresses");

router.use("/", utilRouter);
router.use("/users", userRouter);
router.use("/userInvites", userInvitesRouter);
router.use("/loans", loansRouter);
router.use("/countryCurrency", countryCurrencyRouter);
router.use("/currency", currencyRouter);
router.use("/paymentMethods", paymentMethodsRouter);
router.use("/status", statusRouter);
router.use("/shippingAddresses", shippingAddressesRouter);
router.use("/notifications", notificationsRouter);
router.use("/stripe", stripeRouter);

module.exports = router;
