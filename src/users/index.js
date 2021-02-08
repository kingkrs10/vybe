const express = require("express");
const router = express.Router();
const usersController = require("./controller");
const commonModel = require('../common/common');

router.post("/", commonModel.upload.single('image'), usersController.create);
router.put("/:id", commonModel.upload.single('image'), usersController.update);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getOne);
router.delete("/:id", usersController.remove);
router.put("/location/:id", commonModel.upload.none(), usersController.updateLocation);
router.put("/blockedUsers/:id", commonModel.upload.none(), usersController.updateBlockedUsers);
router.put("/blockedUsers/:id", commonModel.upload.none(), usersController.updateBlockedUsers);

module.exports = router;
