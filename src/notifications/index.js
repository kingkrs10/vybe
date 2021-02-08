const express = require("express");
const router = express.Router();
const notificationsController = require("./controller");
const commonModel = require('../common/common');

router.post("/", commonModel.upload.none(), notificationsController.create);
router.get("/:id", notificationsController.getUsersNotification);

module.exports = router;
