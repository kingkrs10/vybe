const express = require("express");
const router = express.Router();
const shopCollectionsController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   shopCollectionsController.create
);

router.put(
   "/:id",
   authMiddleware,
   shopCollectionsController.update
)

router.get(
   "/",
   authMiddleware,
   shopCollectionsController.getAll
);

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