const express = require("express");
const router = express.Router();
const offersController = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.post("/",
   authMiddleware,
   upload.array("image", 10),
   offersController.create
);
router.post(
   "/getInfo",
   authMiddleware,
   upload.none(),
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
   upload.array("image", 10),
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
   upload.none(),
   offersController.saveFavorites
);
router.post(
   "/report",
   authMiddleware,
   upload.none(),
   offersController.saveReport
);
module.exports = router;
