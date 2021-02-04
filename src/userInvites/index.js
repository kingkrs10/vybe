const express = require("express");
const router = express.Router();
const usersInvitesController = require("./controller");
const commonModel = require('../common/common');

router.post("/invites", commonModel.upload.none(), usersInvitesController.create);
router.put("/invites/:id", commonModel.upload.none(), usersInvitesController.update);
router.get("/invites/:id", commonModel.upload.none(), usersInvitesController.getUserInvites);

module.exports = router;
