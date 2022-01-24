const express = require("express");
const router = express.Router();
const productsController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   productsController.create
)

router.get(
   "/home",
   authMiddleware,
   productsController.homepageProducts
)

router.get(
   "/shop/:shopId",
   authMiddleware,
   productsController.getShopProducts
)

router.get(
   "/shopCollections/:shopId/:collectionId",
   authMiddleware,
   productsController.getShopCollectionProducts
)

router.put(
   "/:id",
   authMiddleware,
   productsController.update
)

router.get(
   "/",
   authMiddleware,
   productsController.getAll
)

router.get(
   "/:id",
   authMiddleware,
   productsController.getOne
)

router.delete(
   "/:id",
   authMiddleware,
   productsController.remove
)

router.post(
   "/productAvailabilty",
   authMiddleware,
   productsController.productAvailabilty
)

router.get(
   "/relativeProducts/:categoryItemId",
   authMiddleware,
   productsController.relativeProducts
)

module.exports = router;