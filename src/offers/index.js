const express = require("express");
const router = express.Router();
const offersController = require("./controller");
const commonModel = require("../common/common");

router.post("/", commonModel.upload.single("image"), offersController.create);
router.post("/getInfo", commonModel.upload.none(), offersController.getAll);
router.put("/:id", commonModel.upload.single("image"), offersController.update);
router.get("/:id", offersController.getOne);
router.delete("/:id", offersController.remove);
router.post(
   "/favorites",
   commonModel.upload.none(),
   offersController.saveFavorites
);
router.post("/report", commonModel.upload.none(), offersController.saveReport);
// router.get("/", offersController.getAll);

module.exports = router;
