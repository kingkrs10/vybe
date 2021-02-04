const express = require("express");
const router = express.Router();
const notificationsController = require("./controller");
const commonModel = require('../common/common');

router.post("/invites", commonModel.upload.none(), notificationsController.create);
router.get("/invites/:id", notificationsController.getUsersNotification);

module.exports = router;
