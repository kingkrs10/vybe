const express = require("express");
const router = express.Router();
const offersController = require("./controller");
const { authMiddleware } = require('../common/common');

router.post("/",
   authMiddleware,
   offersController.create
);

router.post(
   "/getInfo",
   authMiddleware,
   offersController.getAll
);

router.get(
   "/",
   authMiddleware,
   offersController.getAllOffers
);

router.put(
   "/:id",
   authMiddleware,
   offersController.update
);

router.get(
   "/categories",
   authMiddleware,
   offersController.getCategories
);

router.get(
   "/locations",
   authMiddleware,
   offersController.getAllLocation
);

router.get(
   "/userfavorites/:id",
   authMiddleware,
   offersController.getUserfavorites
);

router.get(
   "/user/:id",
   authMiddleware,
   offersController.getUserOffers
);

router.get(
   "/:id",
   authMiddleware,
   offersController.getOne
);

router.delete(
   "/:id",
   authMiddleware,
   offersController.remove
);

router.post(
   "/favorites",
   authMiddleware,
   offersController.saveFavorites
);
router.post(
   "/report",
   authMiddleware,
   offersController.saveReport
);

router.get(
   "/offerFavoriter/:id",
   authMiddleware,
   offersController.getOfferFavoriters
);

module.exports = router;
