const express = require("express");
const router = express.Router();
const usersController = require("./controller");
const commonModel = require('../common/common');


router.post("/", commonModel.upload.single('image'), usersController.create);
router.put("/:id", commonModel.upload.single('image'), usersController.update);
router.put("/location/:id", commonModel.upload.none(), usersController.updateLocation);
router.put("/blockedUsers/:id", commonModel.upload.none(), usersController.updateBlockedUsers);
router.post("/invites", commonModel.upload.none(), usersController.saveUserInvites);
router.put("/invites/:id", commonModel.upload.none(), usersController.updateUserInvites);
router.get("/", usersController.getAll);
router.get("/:id", usersController.getOne);
router.delete("/:id", usersController.remove);

module.exports = router;
