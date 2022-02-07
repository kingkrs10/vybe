const express = require("express");
const router = express.Router();
const serviceReviewsController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   serviceReviewsController.create
);

router.put(
   "/:id",
   authMiddleware,
   serviceReviewsController.update
);

router.get(
   "/totalCal/:serviceId",
   authMiddleware,
   serviceReviewsController.getServiceReviewtotal
);

router.get(
   "/:serviceId",
   authMiddleware,
   serviceReviewsController.getAll
);

router.get(
   "/:serviceId/:serviceReviewId",
   authMiddleware,
   serviceReviewsController.getOne
);

router.delete(
   "/:id",
   authMiddleware,
   serviceReviewsController.remove
);

module.exports = router;