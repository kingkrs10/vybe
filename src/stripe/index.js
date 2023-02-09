const express = require("express");
const router = express.Router();
const stripeController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/createCustomer", authMiddleware, stripeController.createCustomer);

router.post(
  "/createCustomerCard",
  authMiddleware,
  stripeController.createCustomerCard
);

router.post(
  "/defaultpaymentcard",
  authMiddleware,
  stripeController.updateDefaultPaymentCard
);

router.post(
  "/customerDetails",
  authMiddleware,
  stripeController.geCustomerDetails
);

router.post(
  "/customerCardDetails",
  authMiddleware,
  stripeController.getAllCardDetails
);

router.post("/payment", authMiddleware, stripeController.payWithStripe);

router.get("/paymentIntent", authMiddleware, stripeController.paymentIntent);

router.delete(
  "/removeCustomerCard/:id/:cardId",
  authMiddleware,
  stripeController.removeCustomerCard
);

router.post("/webhook", authMiddleware, stripeController.webhook);

module.exports = router;
