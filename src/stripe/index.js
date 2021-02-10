const express = require("express");
const router = express.Router();
const stripeController = require("./controller");
const commonModel = require('../common/common');

router.post("/createCustomer", commonModel.upload.none(), stripeController.createCustomer);
router.post("/createCustomerCard", commonModel.upload.none(), stripeController.createCustomerCard);
router.post("/defaultpaymentcard", stripeController.updateDefaultPaymentCard);
router.get("/getAllCardDetails/:id", stripeController.getAllCardDetails);
router.delete("/removeCustomerCard/:id/:cardId", stripeController.removeCustomerCard);

module.exports = router;
