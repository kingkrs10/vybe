const express = require("express");
const router = express.Router();
const productReviewsController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   productReviewsController.create
);

router.put(
   "/:id",
   authMiddleware,
   productReviewsController.update
);

router.get(
   "/totalCal/:productId",
   authMiddleware,
   productReviewsController.getReviewtotal
);

router.get(
   "/:productId",
   authMiddleware,
   productReviewsController.getAll
);

router.get(
   "/:productId/:productReviewId",
   authMiddleware,
   productReviewsController.getOne
);

router.delete(
   "/:id",
   authMiddleware,
   productReviewsController.remove
);

module.exports = router;