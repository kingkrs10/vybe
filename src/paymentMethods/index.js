const express = require("express");
const router = express.Router();
const paymentMethodsController = require("./controller");
const { authMiddleware} = require('../common/common');

router.get(
   "/",
   authMiddleware,
   paymentMethodsController.getAll
);

module.exports = router;