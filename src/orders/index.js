const express = require("express");
const router = express.Router();
const ordersController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   ordersController.create
);

router.get(
   "/:shopId/:orderId",
   authMiddleware,
   ordersController.getOne
);

router.get(
   "/:shopId",
   authMiddleware,
   ordersController.getAll
)

router.post(
   "/updateStatus/:id",
   authMiddleware,
   ordersController.updateStatus
);

module.exports = router;