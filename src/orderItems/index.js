const express = require("express");
const router = express.Router();
const orderItemsController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   orderItemsController.create
);

router.put(
   "/:Id",
   authMiddleware,
   orderItemsController.update
);

router.get(
   "/getCardDetails",
   authMiddleware,
   orderItemsController.getCardDetails
);

router.get(
   "/",
   authMiddleware,
   orderItemsController.getAll
);

router.get(
   "/:userId/:orderItemId",
   authMiddleware,
   orderItemsController.getOne
);

router.delete(
   "/:orderItemId",
   authMiddleware,
   orderItemsController.remove
);

module.exports = router;