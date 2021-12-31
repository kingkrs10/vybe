const express = require("express");
const router = express.Router();
const shopCollectionsController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   shopCollectionsController.create
);

router.get(
   "/",
   authMiddleware,
   shopCollectionsController.getAll
);

router.get(
   "/shop/:shopId",
   authMiddleware,
   shopCollectionsController.getShopCollections
);

router.put(
   "/:id",
   authMiddleware,
   shopCollectionsController.update
)

router.get(
   "/:id",
   authMiddleware,
   shopCollectionsController.getOne
);

router.delete(
   "/:id",
   authMiddleware,
   shopCollectionsController.remove
);

module.exports = router;