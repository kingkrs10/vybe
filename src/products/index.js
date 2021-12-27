const express = require("express");
const router = express.Router();
const productsController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   upload.single('image'),
   productsController.create
)

router.put(
   "/:id",
   authMiddleware,
   upload.single('image'),
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

module.exports = router;