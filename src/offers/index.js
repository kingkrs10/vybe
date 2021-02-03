const express = require("express");
const router = express.Router();
const offersController = require("./controller");
const commonModel = require('../common/common');


router.post("/", commonModel.upload.single('image'), offersController.create);
router.put("/:id", commonModel.upload.single('image'), offersController.update);
router.put("/updateFavorites/:id", commonModel.upload.none(), offersController.updateFavorites);
router.get("/", offersController.getAll);
router.get("/:id", offersController.getOne);
router.delete("/:id", offersController.remove);

module.exports = router;
