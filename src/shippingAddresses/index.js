const express = require("express");
const router = express.Router();
const shippingAddressesController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   shippingAddressesController.create
)

router.put(
   "/:addressId",
   authMiddleware,
   shippingAddressesController.update
)

router.get(
   "/",
   authMiddleware,
   shippingAddressesController.getAll
)

router.get(
   "/:addressId",
   authMiddleware,
   shippingAddressesController.getOne
)

router.delete(
   "/:addressId",
   authMiddleware,
   shippingAddressesController.remove
)

module.exports = router;