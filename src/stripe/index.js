const express = require("express");
const router = express.Router();
const stripeController = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.post(
    "/createCustomer",
    authMiddleware,
    upload.none(),
    stripeController.createCustomer
);

router.post(
    "/createCustomerCard",
    authMiddleware,
    upload.none(),
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

router.post(
    "/payment",
    authMiddleware,
    stripeController.payWithStripe
);

router.delete(
    "/removeCustomerCard/:id/:cardId",
    authMiddleware,
    stripeController.removeCustomerCard
);


module.exports = router;
